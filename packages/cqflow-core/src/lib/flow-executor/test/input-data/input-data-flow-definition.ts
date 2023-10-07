import { IFlowDefinition } from '../../../flow-definition';
import { NextTypeEnum, DefinitionNodeTypeEnum } from '../../../enums';

export const inputDataFlowDefinition: IFlowDefinition = {
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
        id: 'input_data_1',
        type: NextTypeEnum.Unary,
      },
    },
    input_data_1: {
      id: 'input_data_1',
      bindId: 'enter_weight',
      nodeType: DefinitionNodeTypeEnum.InputData,
      next: {
        type: NextTypeEnum.Unary,
        id: 'true_false_1',
      },
      label: 'Input Weight',
    },
    true_false_1: {
      id: 'true_false_1',
      bindId: 'is_above_100_lbs',
      nodeType: DefinitionNodeTypeEnum.TrueFalse,
      next: {
        type: NextTypeEnum.Binary,
        trueId: 'end_true',
        falseId: 'end_false',
      },
      label: 'Is Above 100 lbs',
    },
    end_true: {
      id: 'end_true',
      label: 'End',
      bindId: 'end_true',
      nodeType: DefinitionNodeTypeEnum.End,
    },
    end_false: {
      id: 'end_false',
      label: 'End',
      bindId: 'end_false',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
