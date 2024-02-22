import sortBy from 'lodash/sortBy';
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import {
  valueSetContainer,
  valueSetLookup,
  ExampleCodings,
} from '@cqlab/cqexamples';

@Controller('vocabulary')
export class VocabularyController {
  @Get('value-sets')
  getValueSets() {
    return Object.keys(valueSetLookup).map((key) => ({
      id: key,
      label: key,
    }));
  }

  @Get('value-sets/:id')
  async getValueSetById(@Param('id') id: string) {
    const valueSet = await valueSetContainer.getValueSetById(id);
    return valueSet.getAllCodes();
  }

  @Get('codes')
  async getCodes() {
    return sortBy(Object.values(ExampleCodings), 'code');
  }
}
