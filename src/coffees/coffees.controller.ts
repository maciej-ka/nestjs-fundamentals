import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Res() response) {
    response.status(200).send('all coffees');
  }

  @Get('flavors')
  findFlavors() {
    return 'all flavors';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `one coffee by id ${id}`;
  }

  @Post()
  @HttpCode(410)
  create(@Body() body) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return `updates ${id} with ${JSON.stringify(body)}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `deletes ${id}`;
  }
}
