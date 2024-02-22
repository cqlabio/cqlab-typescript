export * from './flow-definition-node';
export * from './form-field-node';
import { IFlowDefinitionNode } from './flow-definition-node';

export interface IFlowDefinition {
  id: string;
  createdAt?: string;
  bindId?: string;
  nodes: Record<string, IFlowDefinitionNode>;
  version?: string;
}
