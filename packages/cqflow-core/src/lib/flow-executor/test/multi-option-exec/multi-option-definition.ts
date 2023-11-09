import { IFlowDefinition } from '../../../flow-definition';
import { NextTypeEnum, DefinitionNodeTypeEnum } from '../../../enums';

export const multiOptionFlowDefinition: IFlowDefinition = {
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
        id: 'multi_option_1',
        type: NextTypeEnum.Unary,
      },
    },
    multi_option_1: {
      id: 'multi_option_1',
      bindId: 'multi_option_1',
      nodeType: DefinitionNodeTypeEnum.MultiOption,
      options: [
        {
          id: '232option_1',
          label: 'Option 1',
          bindId: 'option_1',
        },
        {
          id: '121option_2',
          label: 'Option 2',
          bindId: 'option_2',
        },
      ],
      min: 1,
      max: null,
      next: {
        type: NextTypeEnum.Binary,
        trueId: 'end_1',
        falseId: 'end_2',
      },
      label: 'Is Female',
    },
    end_1: {
      id: 'end_1',
      label: 'End',
      bindId: 'end_wjpevonk',
      nodeType: DefinitionNodeTypeEnum.End,
    },
    end_2: {
      id: 'end_2',
      label: 'End',
      bindId: 'end_wjpevonk',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
