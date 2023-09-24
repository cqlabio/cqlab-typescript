import { ImplementationNodeTypeEnum } from '../enums';
import { IFlowDefinitionNode } from '../flow-definition/flow-definition';

export interface BaseStep<D extends IFlowDefinitionNode> {
  stepType: ImplementationNodeTypeEnum;
  stepId: string;
  nodeDefinition: D;
  // defin: string;node
  flowDefinitionId: string;
  label?: string;
}
