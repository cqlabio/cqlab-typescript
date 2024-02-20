import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
// import { MockDbService } from './mock-db.service';
import {
  IFlowStepAnswer,
  InteractiveFlowState,
  CQFlowExecutorStateEnum,
  InteractiveFlowContextOptions,
  LazyFlowDefinitionRetriever,
  IFlowDefinition,
} from '@cqlab/cqflow-core';
import { FlowInstanceEntity } from '../models/flow-instance.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlowService } from './flow.service';
import { flowRepository } from '@cqlab/cqexamples';

@Injectable()
export class FlowInstanceService {
  constructor(
    private readonly flowService: FlowService,

    @InjectRepository(FlowInstanceEntity)
    private flowInstanceRepo: Repository<FlowInstanceEntity>
  ) {}

  async getFlowInstancesByFlowDefinitionId(
    flowDefinitionId: string
  ): Promise<FlowInstanceEntity[]> {
    return this.flowInstanceRepo.find({
      where: { flowDefinition: { id: flowDefinitionId } },
    });
  }

  async createFlowInstance({
    flowDefinitionId,
    initialData,
  }: {
    flowDefinitionId: string;
    initialData: any;
  }) {
    const flowDef = await this.flowService.getDefinitionById(flowDefinitionId);
    if (!flowDef) {
      throw new HttpException(
        `FlowDefinition not found with id: ${flowDefinitionId}`,
        HttpStatus.NOT_FOUND
      );
    }

    const flowInstance = new FlowInstanceEntity();
    flowInstance.answers = [];

    flowInstance.flowDefinition = flowDef;
    flowInstance.initialData = initialData;
    flowInstance.status = CQFlowExecutorStateEnum.Initiated;
    flowInstance.actionsTaken = {};
    await this.flowInstanceRepo.save(flowInstance);
    return flowInstance;
  }

  async getFlowInstanceActiveSteps(flowInstanceId: string) {
    const flowInstance = await this.flowInstanceRepo.findOne({
      where: { id: flowInstanceId },
      relations: {
        flowDefinition: true,
      },
    });

    // const flowDefinition = findFlowDefinitionByBindId(flowInstance.flowId);

    if (!flowInstance) {
      throw new HttpException(
        `Unable to find flowInstance by id: ${flowInstanceId}`,
        HttpStatus.NOT_FOUND
      );
      // throw new Error('Unable to find flow definition: ' + flowInstance.flowId);
    }

    const module = flowRepository.getInteractiveModule(
      flowInstance.flowDefinition.bindId
    );

    if (!module) {
      throw new Error(
        'Unable to find module for flow definition: ' +
          flowInstance.flowDefinition.bindId
      );
    }

    const onUpdate = async (nextFlowInstance: InteractiveFlowState<any>) => {
      // TODO: should this update the DB when an action is triggered??
      return nextFlowInstance;
    };


    const flowServiceLocal = this.flowService

    class FlowDefinitionRetriever extends LazyFlowDefinitionRetriever {
      data: Record<string, IFlowDefinition> = {};
    
      async loadFlowDefinitionById(id: string): Promise<IFlowDefinition> {
        if (!this.data[id]) {
          const flowDef = await flowServiceLocal.getDefinitionById(id);
          if (!flowDef) {
            throw new Error(`No flow definition for id: ${id}`);
          }
          this.data[id] = flowDef;
        }
        return this.data[id];
      }
    }

    const opts: InteractiveFlowContextOptions<any, string> = {
      flowDefinitionId: flowInstance.flowDefinition.id,
      initialData: flowInstance.initialData,
      flowDefinitionRetriever: new FlowDefinitionRetriever(),
      interactiveFlowState: flowInstance,
      onUpdateInteractiveState: onUpdate,
    };

    const activeSteps = await module.execute(opts);

    return {
      status: CQFlowExecutorStateEnum.Initiated,
      steps: activeSteps,
    };
  }

  async addFlowInstanceAnswer(
    flowInstanceId: string,
    answer: { stepId: string; answer: IFlowStepAnswer }
  ) {
    // const flowInstance = this.mockDbService.getFlowInstanceById(flowInstanceId);
    const flowInstance = await this.flowInstanceRepo.findOne({
      where: { id: flowInstanceId },
    });

    if (!flowInstance) {
      throw new HttpException(
        `Unable to find flowInstance by id: ${flowInstanceId}`,
        HttpStatus.NOT_FOUND
      );
    }

    flowInstance.answers.push(answer);

    await this.flowInstanceRepo.save(flowInstance);

    // const nextFlowInstance = {
    //   ...flowInstance,
    //   answers: [...flowInstance.answers, answer],
    // };
    // this.mockDbService.updateFlowInstance(nextFlowInstance);
    return flowInstance;
  }

  removeFlowInstanceById(flowInstanceId: string) {
    return this.flowInstanceRepo.delete({ id: flowInstanceId });
  }
}
