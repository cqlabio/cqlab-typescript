import { ImplementationNodeTypeEnum } from '../enums';

export interface BaseStep {
  stepType: ImplementationNodeTypeEnum;
  nodeId: string;
  flowDefinitionId: string;
  label?: string;
}
