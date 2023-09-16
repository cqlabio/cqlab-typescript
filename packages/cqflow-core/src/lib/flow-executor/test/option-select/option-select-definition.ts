import { IFlowDefintion } from '../../../flow-definition/flow-definition';
import { NextTypeEnum, DefinitionNodeTypeEnum } from '../../../enums';

export const optionSelectDefinition: IFlowDefintion = {
  id: 'optionSelectNode',
  bindId: 'optionSelectNode',
  version: '0.0.1',
  nodes: {
    start_1: {
      id: 'start_1',
      bindId: 'start_fgrtmdsd',
      nodeType: DefinitionNodeTypeEnum.Start,
      label: 'Start',
      next: {
        id: 'option_select_1',
        type: NextTypeEnum.Unary,
      },
    },
    option_select_1: {
      id: 'option_select_1',
      bindId: 'option_select_1',
      label: 'Choose Option',
      nodeType: DefinitionNodeTypeEnum.OptionSelect,
      next: {
        type: NextTypeEnum.Unary,
        id: 'end_1',
      },
      options: [
        {
          id: 'option_1',
          bindId: 'option_1',
          label: 'Option 1',
        },
        {
          id: 'option_2',
          bindId: 'option_2',
          label: 'Option 2',
        },
      ],
    },
    end_1: {
      id: 'end_1',
      label: 'End',
      bindId: 'end_wjpevonk',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
