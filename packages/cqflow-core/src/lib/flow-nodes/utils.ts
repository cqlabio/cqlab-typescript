import { IFlowDefinitionNode } from '../flow-definition';
import { DefinitionNodeTypeEnum } from '../enums';

export function isBooleanNode(node: IFlowDefinitionNode) {
  return (
    node.nodeType === DefinitionNodeTypeEnum.TrueFalse ||
    node.nodeType === DefinitionNodeTypeEnum.LogicTree ||
    node.nodeType === DefinitionNodeTypeEnum.MultiOption
  );
}

export function isNextNode(node: IFlowDefinitionNode) {
  return (
    node.nodeType === DefinitionNodeTypeEnum.Start ||
    node.nodeType === DefinitionNodeTypeEnum.EmitData ||
    node.nodeType === DefinitionNodeTypeEnum.Action ||
    node.nodeType === DefinitionNodeTypeEnum.SubFlow ||
    node.nodeType === DefinitionNodeTypeEnum.Narrative ||
    node.nodeType === DefinitionNodeTypeEnum.CustomForm ||
    node.nodeType === DefinitionNodeTypeEnum.FormField
  );
}
