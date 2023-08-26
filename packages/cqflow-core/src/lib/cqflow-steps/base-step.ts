import { ImplementationNodeTypeEnum } from '../enums';
import { IFlowDefinitionNode } from '../cqflow-definition/cqflow-definition';
export interface BaseStep {
  stepType: ImplementationNodeTypeEnum;
  stepId: string;
  nodeDefinition: IFlowDefinitionNode;
  // defin: string;node
  flowDefinitionId: string;
  label?: string;
}
