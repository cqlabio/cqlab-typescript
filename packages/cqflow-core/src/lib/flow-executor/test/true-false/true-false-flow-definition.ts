import { IFlowDefinition } from '../../../flow-definition/flow-definition';
import { NextTypeEnum, DefinitionNodeTypeEnum } from '../../../enums';

export const trueFalseFlowDefinition: IFlowDefinition = {
  id: 'simpleFlow',
  bindId: 'simpleFlow',
  version: '0.0.1',
  nodes: {
    start_1: {
      id: 'start_1',
      bindId: 'start_fgrtmdsd',
      nodeType: DefinitionNodeTypeEnum.Start,
      label: 'Start',
      next: {
        id: 'true_false_1',
        type: NextTypeEnum.Unary,
      },
    },
    true_false_1: {
      id: 'true_false_1',
      bindId: 'is_female',
      nodeType: DefinitionNodeTypeEnum.TrueFalse,
      next: {
        type: NextTypeEnum.Binary,
        trueId: 'emit_data_1',
        falseId: 'end_1',
      },
      label: 'Is Female',
    },
    emit_data_1: {
      id: 'emit_data_1',
      bindId: 'contextdata_pejfcujt',
      label: 'Recommend Mammogram',
      nodeType: DefinitionNodeTypeEnum.EmitData,
      next: {
        id: 'end_1',
        type: NextTypeEnum.Unary,
      },
    },
    end_1: {
      id: 'end_1',
      label: 'End',
      bindId: 'end_wjpevonk',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
