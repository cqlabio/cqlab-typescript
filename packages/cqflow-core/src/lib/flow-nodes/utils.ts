import { IFlowDefinitionNode } from '../flow-definition/flow-definition';
import { DefinitionNodeTypeEnum } from '../enums';

export function isBooleanNode(node: IFlowDefinitionNode) {
  return (
    node.nodeType === DefinitionNodeTypeEnum.TrueFalse ||
    // node.nodeType === DefinitionNodeTypeEnum.Exec ||
    node.nodeType === DefinitionNodeTypeEnum.LogicTree
  );
}

export function isNextNode(node: IFlowDefinitionNode) {
  return (
    node.nodeType === DefinitionNodeTypeEnum.Start ||
    node.nodeType === DefinitionNodeTypeEnum.EmitData ||
    node.nodeType === DefinitionNodeTypeEnum.Action ||
    node.nodeType === DefinitionNodeTypeEnum.SubFlow ||
    node.nodeType === DefinitionNodeTypeEnum.InputData ||
    node.nodeType === DefinitionNodeTypeEnum.Narrative ||
    node.nodeType === DefinitionNodeTypeEnum.OptionSelect
  );
}
