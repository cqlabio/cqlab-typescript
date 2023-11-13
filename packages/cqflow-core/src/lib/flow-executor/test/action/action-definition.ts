import { IFlowDefinition } from '../../../flow-definition';
import {
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  ActionEnum,
} from '../../../enums';

export const actionDefinition: IFlowDefinition = {
  id: 'actionDef',
  bindId: 'actionDef',
  version: '0.0.1',
  nodes: {
    start_1: {
      id: 'start_1',
      bindId: 'start_fgrtmdsd',
      nodeType: DefinitionNodeTypeEnum.Start,
      label: 'Start',
      next: {
        id: 'action_1',
        type: NextTypeEnum.Unary,
      },
    },
    action_1: {
      id: 'action_1',
      bindId: 'action_1',
      label: 'Choose Option',
      nodeType: DefinitionNodeTypeEnum.Action,
      min: 1,
      max: 1,
      actions: [
        {
          id: 'action_option_1',
          actionType: ActionEnum.Order,
          bindId: 'action_option_1',
          label: 'Option 1',
        },
        {
          id: 'action_option_2',
          actionType: ActionEnum.Order,
          bindId: 'action_option_2',
          label: 'Option 2',
        },
      ],
      next: {
        type: NextTypeEnum.Unary,
        id: 'end_1',
      },
    },
    end_1: {
      id: 'end_1',
      label: 'End',
      bindId: 'end_1',
      nodeType: DefinitionNodeTypeEnum.End,
    },
  },
};
