import { IFlowDefinition } from '../../../flow-definition/flow-definition';
import { NextTypeEnum, DefinitionNodeTypeEnum } from '../../../enums';

export const branchChoiceDefinition: IFlowDefinition = {
  id: 'branchChoice',
  bindId: 'branchChoice',
  version: '0.0.1',
  nodes: {
    start_1: {
      id: 'start_1',
      bindId: 'start_fgrtmdsd',
      nodeType: DefinitionNodeTypeEnum.Start,
      label: 'Start',
      next: {
        id: 'branch_1',
        type: NextTypeEnum.Unary,
      },
    },
    branch_1: {
      id: 'branch_1',
      bindId: 'branch_1',
      label: 'Choose Option',
      nodeType: DefinitionNodeTypeEnum.Branch,
      next: {
        type: NextTypeEnum.Multi,
        options: [
          {
            toId: 'end_1',
            id: 'option_1',
            bindId: 'option_1',
            label: 'Option 1',
          },
          {
            toId: 'end_2',
            id: 'option_2',
            bindId: 'option_2',
            label: 'Option 2',
          },
        ],
      },
    },
    end_1: {
      id: 'end_1',
      label: 'End',
      bindId: 'end_1',
      nodeType: DefinitionNodeTypeEnum.End,
    },
    end_2: {
      id: 'end_2',
      label: 'End',
      bindId: 'end_2',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
