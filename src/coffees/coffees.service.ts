import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import PaginationDto from 'src/common/dto/pagination-query.dto';
import { COFFEE_BRANDS } from './coffees.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(COFFEE_BRANDS) coffeeBrands: string[],
    private readonly configService: ConfigService,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log(this.coffeesConfiguration);
    console.log('CoffeeService instantiated');
    // const databaseHost = this.configService.get<string>('DATABASE_HOST', 'localhost')
    const databaseHost = this.configService.get('database.host', 'localhost')
    console.log(databaseHost);
    // const coffeesConfig = this.configService.get('coffees')
    // console.log(coffeesConfig);
  }

  findAll(paginationQuery?: PaginationDto) {
    return this.coffeeRepository.find({
      skip: paginationQuery?.offset,
      take: paginationQuery?.limit,
      relations: ['flavors'],
      order: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`coffee ${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: any) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name: string) =>
        this.preloadFlavorByName(name),
      ),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  async update(id: number, updateCoffeeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeeDto.flavors &&
      (await Promise.all(
        updateCoffeeeDto.flavors.map((name: string) =>
          this.preloadFlavorByName(name),
        ),
      ));
    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`coffeee ${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;
      const event = new Event()
      event.name = 'recommend_coffee'
      event.type = 'coffee'
      event.payload = { coffeeId: coffee.id }
      await queryRunner.manager.save(event)
      await queryRunner.manager.save(coffee)
      await queryRunner.commitTransaction()
    } catch {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
