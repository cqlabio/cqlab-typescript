import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IFlowDefinition } from '@cqlab/cqflow-core';
import { FlowInstanceEntity } from './flow-instance.entity';

@Entity()
export class FlowDefinitionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ type: 'varchar' })
  bindId: string;

  @Column({ type: 'simple-json' })
  nodes: IFlowDefinition['nodes'];
  // graph: IFlowDefinition['nodes']
}
