import { Injectable } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Shipwrect Roast',
      brand: 'Buddy Brew',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  findAll() {
    return this.coffees;
  }

  findOne(id: string) {
    return this.coffees.find(item => item.id === +id)
  }

  create(createCoffeeDto: any) {
    this.coffees.push(createCoffeeDto)
  }

  update(id: string, updateCoffeeeDto: Partial<Coffee>) {
    const existingCoffee = this.findOne(id)
    if (existingCoffee) {
      // update
    }
  }

  remove(id: string) {
    const coffeeeIndex = this.coffees.findIndex(item => item.id === +id)
    if (coffeeeIndex >= 0) {
      this.coffees.splice(coffeeeIndex, 1)
    }
  }
}
