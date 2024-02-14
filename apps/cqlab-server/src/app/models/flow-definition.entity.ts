import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { IFlowDefinition } from '@cqlab/cqflow-core';

@Entity()
export class FlowDefinitionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn()
    createdAt: string

    @Column({type: 'varchar'})
    bindId: string

    @Column({type: "simple-json"})
    nodes: IFlowDefinition['nodes']
    // graph: IFlowDefinition['nodes']
}