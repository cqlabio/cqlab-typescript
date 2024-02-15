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
import { FlowInstanceService } from './flow-instance.service';
import { IFlowStepAnswer } from '@cqlab/cqflow-core';

@Controller('flow-instances')
export class FlowInstanceController {
  constructor(private readonly flowInstanceService: FlowInstanceService) {}

  @Get()
  getFlowInstancesForFlow(@Query('flowDefinitionId') flowDefinitionId: string) {
    return this.flowInstanceService.getFlowInstancesByFlowDefinitionId(
      flowDefinitionId
    );
    // return this.mockDbService.getAllFlowInstanceByFlowId(flowId);
  }

  // @Get(':id')
  // getFlowInstaceById(@Param('id') id: string) {
  //   return this.mockDbService.getFlowInstanceById(id);
  // }

  @Delete(':id')
  removeFlowInstaceById(@Param('id') id: string) {
    return this.flowInstanceService.removeFlowInstanceById(id);
  }

  @Get(':id/active-steps')
  getFlowInstanceActiveSteps(@Param('id') id: string) {
    return this.flowInstanceService.getFlowInstanceActiveSteps(id);
  }

  @Post(':id/answer')
  addFlowInstnaceAnswer(
    @Param('id') id: string,
    @Body()
    body: {
      stepId: string;
      answer: IFlowStepAnswer;
    }
  ) {
    return this.flowInstanceService.addFlowInstanceAnswer(id, body);
  }

  @Post()
  initiateFlowInstance(
    @Body() body: { flowDefinitionId: string; initialData: any }
  ) {
    return this.flowInstanceService.createFlowInstance(body);
    // return this.mockDbService.initiateFlowInstance(id, { patientId: '123' });
  }
}
