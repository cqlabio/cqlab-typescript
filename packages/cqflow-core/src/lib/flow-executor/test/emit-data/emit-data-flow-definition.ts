import { IFlowDefinition } from '../../../flow-definition/flow-definition';
import { NextTypeEnum, DefinitionNodeTypeEnum } from '../../../enums';

export const emitDataFlowDefinition: IFlowDefinition = {
  id: 'emitDataFlow',
  bindId: 'emitDataFlow',
  version: '0.0.1',
  nodes: {
    start_1: {
      id: 'start_1',
      bindId: 'start_fgrtmdsd',
      nodeType: DefinitionNodeTypeEnum.Start,
      label: 'Start',
      next: {
        id: 'narrative_1',
        type: NextTypeEnum.Unary,
      },
    },
    narrative_1: {
      id: 'narrative_1',
      bindId: 'narrative_1',
      nodeType: DefinitionNodeTypeEnum.Narrative,
      label: 'Narrative',
      narrative: 'Narrative',
      next: {
        id: 'emit_data_1',
        type: NextTypeEnum.Unary,
      },
    },
    emit_data_1: {
      id: 'emit_data_1',
      bindId: 'emit_node',
      nodeType: DefinitionNodeTypeEnum.EmitData,
      next: {
        type: NextTypeEnum.Unary,
        id: 'emit_data_2',
      },
      label: 'Input Weight',
    },
    emit_data_2: {
      id: 'emit_data_2',
      bindId: 'emit_node_2',
      nodeType: DefinitionNodeTypeEnum.EmitData,
      next: {
        type: NextTypeEnum.Unary,
        id: 'end_node',
      },
      label: 'Some Weight',
    },
    end_node: {
      id: 'end_node',
      label: 'End',
      bindId: 'end_node',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
