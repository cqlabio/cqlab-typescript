import {
  Controller,
  Get,
  Param,
  Put,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  // Delete,
} from '@nestjs/common';
// import { FlowDefinition } from '@cqlab/cqflow-db';

import { FlowService } from './flow.service';
// import { FlowDefinitionEntity } from './models/flow-definition.entity';
import { IFlowDefinition } from '@cqlab/cqflow-core';
// import { FlowInstanceService } from './flow-instance.service';

@Controller('flows')
export class FlowController {
  constructor(
    private readonly flowService: FlowService,
    // private readonly flowInstanceService: FlowInstanceService
  ) {}

  @Get()
  async getFlowDefinitions(@Query('bindId') bindId: string) {
    if (bindId) {
      const found = await this.flowService.getDefinitionById(bindId);
      if (!found) {
        throw new HttpException(
          `FlowDefinition not found with bindId: ${bindId}`,
          HttpStatus.NOT_FOUND
        );
      }
      return found;
    } else {
      return this.flowService.getDefinitions();
    }

    // return this.flowService.getDefinitions();
  }

  @Get(':id')
  getFlowDefinitionById(@Param('id') id: string) {
    if (!id) {
      throw new HttpException('Valid Id not provided', HttpStatus.BAD_REQUEST);
    }
    return this.flowService.getDefinitionById(id);
  }

  @Put(':id')
  updateFlowDefinition(@Body() data: IFlowDefinition) {
    return this.flowService.updateDefinition(data);
  }

  @Post()
  createFlowDefinition(@Body() data: IFlowDefinition) {
    return this.flowService.createDefinition(data);
  }

  // @Delete(':id')
  // deleteFlowDefinition(@Param('id') id: string) {
  //   return this.flowService.deleteFlowDefinition(id);
  // }

  // @Get(':bindId/flow-instances')
  // getFlowInstancesByFlowBindId(@Param('bindId') bindId: string) {
  //   if (!bindId) {
  //     throw new HttpException('Valid Id not provided', HttpStatus.BAD_REQUEST);
  //   }
  //   return this.flowInstanceService.getFlowInstances(bindId);
  // }
}
