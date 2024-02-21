// id         String   @id @default(uuid()) @db.Uuid
// createdAt  DateTime @default(now())

// flowBindId String

// // flowDefinition      FlowDefinition       @relation(fields: [flowDefinitionId], references: [id])
// // flowDefinitionId String  @db.Uuid

// status String
// answers Json?
// actionsTaken Json?
// initialData Json?

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import {
  CQFlowExecutorStatefulAnswer,
  InteractiveFlowState,
} from '@cqlab/cqflow-core';
import { FlowDefinitionEntity } from './flow-definition.entity';

@Entity()
export class FlowInstanceEntity implements InteractiveFlowState<any, string> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: string;

  @Column({ type: 'varchar' })
  status: string;

  @Column({ type: 'simple-json' })
  answers: CQFlowExecutorStatefulAnswer[];

  @Column({ type: 'simple-json' })
  actionsTaken: any;

  @Column({ type: 'simple-json' })
  initialData: any;

  @ManyToOne((type) => FlowDefinitionEntity)
  flowDefinition: FlowDefinitionEntity;
}
