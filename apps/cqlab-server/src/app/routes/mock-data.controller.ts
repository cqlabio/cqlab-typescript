import { MockPatientIdEnum, mockDataContainer } from '@cqlab/cqexamples';
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Controller('mock-data')
export class MockDataController {
  @Get('')
  getMockData() {
    const allIds = Object.keys(MockPatientIdEnum);
    return allIds.map((id) => ({
      id,
      label: id,
    }));
  }

  @Get(':id')
  async getMockDataById(@Param('id') id: string) {
    const found = await mockDataContainer.loadMockData(id);

    if (!found) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND);
    }

    return {
      id: found.id,
      label: found.id,
      data: found,
    };
  }
}
