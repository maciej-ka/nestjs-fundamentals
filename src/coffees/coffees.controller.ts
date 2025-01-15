import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';

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
    return this.coffeesService.findOne(id);
  }

  @Post()
  @HttpCode(410)
  create(@Body() body: Coffee) {
    this.coffeesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<Coffee>) {
    this.coffeesService.update(id, body)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.coffeesService.remove(id)
  }
}
