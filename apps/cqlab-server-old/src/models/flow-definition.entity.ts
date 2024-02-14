import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"
import { IFlowDefinition } from "../../../../packages/cqflow-core/src"

@Entity()
export class FlowDefinitionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: number

    @CreateDateColumn()
    createdAt: string

    @Column({type: 'varchar'})
    bindId: string

    @Column({type: "simple-json"})
    graph: IFlowDefinition['nodes']
}