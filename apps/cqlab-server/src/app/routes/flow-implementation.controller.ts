import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  Delete,
} from '@nestjs/common';
// import { MockDbService } from './mock-db.service';
import { FlowImplementationService } from './flow-implementation.service';
// import { IFlowStepAnswer } from '@cqlab/cqflow-core';

@Controller('flow-implementations')
export class FlowImplementationController {
  constructor(
    private readonly flowImplementationService: FlowImplementationService
  ) {}

  // @Get()
  // getFlowInstacesForFlow(@Query('flowId') flowId: string) {
  //   return this.mockDbService.getAllFlowInstanceByFlowId(flowId);
  // }

  @Get(':bindId')
  getFlowImplementationById(@Param('bindId') bindId: string) {
    return this.flowImplementationService.getFlowImplementationByBindId(bindId);
  }

  @Get(':bindId/example-inputs')
  getFlowImplementationExampleData(@Param('bindId') bindId: string) {
    return this.flowImplementationService.getFlowImplementationExampleData(
      bindId
    );
  }
}
