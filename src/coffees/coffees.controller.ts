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
  ValidationPipe,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/create-coffee.dto/update-coffee.dto';
import PaginationDto from 'src/common/dto/pagination-query.dto';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(
    private readonly coffeesService: CoffeesService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    console.log('Coffees Controller instantiated');
    console.log(request.method, request.ip);
  }

  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  getPage(@Query() paginationQuery: PaginationDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get('flavors')
  findFlavors() {
    return 'all flavors';
  }

  @Get(':id')
  async findOne(@Protocol('https') protocol: string, @Param('id', ParseIntPipe) id: number) {
    console.log(protocol);
    console.log(id);
    // await new Promise(resolve => setTimeout(resolve, 5000))
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
  update(@Param('id') id: number, @Body(ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
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
