import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../services/prisma.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlowDefinitionEntity } from './models/flow-definition.entity';
import { IFlowDefinition } from '../../../packages/cqflow-core/src';

@Injectable()
export class FlowService {
  constructor(
    @InjectRepository(FlowDefinitionEntity)
    private flowDefRepo: Repository<FlowDefinitionEntity>,
    
  ) {}

  async getDefinitions(): Promise<FlowDefinitionEntity[]> {
    return this.flowDefRepo.find();
    // const defs = await this.prisma.flowDefinition.findMany({
    //   orderBy: [
    //     {
    //       bindId: 'asc',
    //     },
    //   ],
    // });
    // return defs;
  }

  // async getDefinitionById(id: string): Promise<FlowDefinition> {
  //   return this.prisma.flowDefinition.findFirst({
  //     where: { id: id },
  //   });
  // }

  // async getDefinitionByBindId(bindId: string): Promise<FlowDefinition> {
  //   return this.prisma.flowDefinition.findFirst({
  //     where: { bindId: bindId },
  //   });
  // }

  async createDefinition(
    flowDefinition: IFlowDefinition
  ): Promise<FlowDefinitionEntity> {

    const flowDef = new FlowDefinitionEntity()
    flowDef.bindId = flowDefinition.bindId || ''
    flowDef.graph = flowDefinition.nodes
    await this.flowDefRepo.save(flowDef)
    return flowDef


    // return await this.prisma.flowDefinition.create({
    //   data: flowDefinition,
    // });
  }

  // async deleteFlowDefinition(flowDefId: string): Promise<{ success: boolean }> {
  //   const flowDefinition = await this.getDefinitionById(flowDefId);

  //   await this.prisma.flowInstance.deleteMany({
  //     where: {
  //       flowBindId: flowDefinition.bindId,
  //     },
  //   });

  //   await this.prisma.flowDefinition.delete({
  //     where: {
  //       id: flowDefId,
  //     },
  //   });

  //   return { success: true };
  // }

  // async updateDefinition(
  //   flowDefinition: FlowDefinition
  // ): Promise<FlowDefinition> {
  //   return await this.prisma.flowDefinition.update({
  //     where: {
  //       id: flowDefinition.id,
  //     },
  //     data: flowDefinition,
  //   });
  // }
}
