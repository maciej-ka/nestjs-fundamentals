import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
})

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: getRepositoryToken(Flavor), useValue: createMockRepository() },
        { provide: getRepositoryToken(Coffee), useValue: createMockRepository() },
        { provide: DataSource, useValue: {} },
        { provide: ConfigService, useValue: { get: () => {}} },
        { provide: 'COFFEE_BRANDS', useValue: [] },
        { provide: coffeesConfig.KEY, useValue: {} },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    // service = await module.resolve(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee))
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when coffee with ID exists', () => {
      it('should return the coffee object', async () => {
        const coffeeId = 1;
        const expectedCoffee = {};

        coffeeRepository.findOne.mockReturnValue(expectedCoffee)
        const coffee = await service.findOne(coffeeId);
        expect(coffee).toEqual(expectedCoffee);
      })
    })

    describe('otherwise', () => {
      it('should throw the "NotFoundException"', async () => {
        const coffeeId = 1;
        coffeeRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne(coffeeId)
        } catch (err) {
          expect(err).toBeInstanceOf(NotFoundException)
          expect(err.message).toEqual(`coffee ${coffeeId} not found`);
        }
      })
    })
  })
});
