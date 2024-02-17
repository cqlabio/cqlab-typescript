import sortBy from 'lodash/sortBy';
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
  valueSetContainer,
  valueSetLookup,
  ExampleCodings,
} from '@cqlab/cqexamples';

import { SeedDBService } from './seed-db.service';

@Controller('seed-db')
export class SeedDBController {
  constructor(private readonly seedService: SeedDBService) {}

  @Post()
  runSeed() {
    return this.seedService.runSeed()
  }
}
