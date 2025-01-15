import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  // @Get()
  // findAll(@Res() response) {
  //   response.status(200).send('all coffees');
  // }

  @Get()
  findAll() {
    return this.coffeesService.findAll()
  }

  @Get("/paging")
  getPage(@Query() query) {
    return `page ${query.page} with limit ${query.limit}`
  }

  @Get('flavors')
  findFlavors() {
    return 'all flavors';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const found = this.coffeesService.findOne(id);
    if (!found) {
      throw new NotFoundException(`coffeee ${id} not found`)
    }
    return found;
  }

  @Post()
  @HttpCode(410)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    this.coffeesService.update(id, updateCoffeeDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.coffeesService.remove(id)
  }
}
