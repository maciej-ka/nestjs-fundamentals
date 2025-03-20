import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import PaginationDto from 'src/common/dto/pagination-query.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('Coffees Controller instantiated');
    console.log(request.method, request.ip);
  }

  @Get()
  getPage(@Query() paginationQuery: PaginationDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get('flavors')
  findFlavors() {
    return 'all flavors';
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(410)
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    console.log(
      'is dto an instance of createCoffeeeDto:',
      createCoffeeDto instanceof CreateCoffeeDto,
    );
    this.coffeesService.create(createCoffeeDto);
    return createCoffeeDto;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    this.coffeesService.remove(id);
  }

  @Post('recommend/:id')
  async recommend(@Param('id') id: number) {
    const coffee = await this.coffeesService.findOne(id);
    return await this.coffeesService.recommendCoffee(coffee);
  }
}
