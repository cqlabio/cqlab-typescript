import { DefinitionNodeTypeEnum } from '@cqlab/cqflow-core';

const BLUE = '#1976D2';
const BLUE_LIGHT = '#90CAF9';

const PURPLE = '#7B1FA2';
const PURPLE_LIGHT = '#D1C4E9';

const GOLD = '#AB8600';
const GOLD_LIGHT = '#EDC531';

export function getNodeColor(nodeType: DefinitionNodeTypeEnum) {
  if (
    nodeType === DefinitionNodeTypeEnum.Start ||
    nodeType === DefinitionNodeTypeEnum.End ||
    nodeType === DefinitionNodeTypeEnum.SubFlow ||
    nodeType === DefinitionNodeTypeEnum.Narrative ||
    nodeType === DefinitionNodeTypeEnum.Note
  ) {
    return 'rgb(100,100,100)';
  } else if (
    nodeType === DefinitionNodeTypeEnum.TrueFalse ||
    nodeType === DefinitionNodeTypeEnum.MultiOption ||
    nodeType === DefinitionNodeTypeEnum.LogicTree ||
    nodeType === DefinitionNodeTypeEnum.Branch
  ) {
    return GOLD;
  } else if (
    nodeType === DefinitionNodeTypeEnum.EmitData ||
    nodeType === DefinitionNodeTypeEnum.Action
  ) {
    return BLUE;
  } else if (
    nodeType === DefinitionNodeTypeEnum.CustomForm ||
    nodeType === DefinitionNodeTypeEnum.FormField
  ) {
    return PURPLE;
  } else {
    throw new Error('Color not confugured for node type: ' + nodeType);
  }
}

export function getNodeColorLight(nodeType: DefinitionNodeTypeEnum) {
  if (
    nodeType === DefinitionNodeTypeEnum.Start ||
    nodeType === DefinitionNodeTypeEnum.End ||
    nodeType === DefinitionNodeTypeEnum.SubFlow ||
    nodeType === DefinitionNodeTypeEnum.Narrative ||
    nodeType === DefinitionNodeTypeEnum.Note
  ) {
    return 'rgb(220,220,220)';
  } else if (
    nodeType === DefinitionNodeTypeEnum.TrueFalse ||
    nodeType === DefinitionNodeTypeEnum.MultiOption ||
    nodeType === DefinitionNodeTypeEnum.LogicTree ||
    nodeType === DefinitionNodeTypeEnum.Branch
  ) {
    return GOLD_LIGHT;
  } else if (
    nodeType === DefinitionNodeTypeEnum.EmitData ||
    nodeType === DefinitionNodeTypeEnum.Action
  ) {
    return BLUE_LIGHT;
  } else if (
    nodeType === DefinitionNodeTypeEnum.CustomForm ||
    nodeType === DefinitionNodeTypeEnum.FormField
  ) {
    return PURPLE_LIGHT;
  } else {
    throw new Error('Color not confugured for node type: ' + nodeType);
  }
}
