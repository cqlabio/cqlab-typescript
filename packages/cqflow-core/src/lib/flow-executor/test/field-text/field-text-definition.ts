import { IFlowDefinition } from '../../../flow-definition';
import {
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  FieldTypeEnum,
} from '../../../enums';

export const fieldTextDef: IFlowDefinition = {
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
        id: 'field_text_1',
        type: NextTypeEnum.Unary,
      },
    },
    field_text_1: {
      id: 'field_text_1',
      bindId: 'field_text_1',
      label: 'Choose Option',
      nodeType: DefinitionNodeTypeEnum.FormField,
      fieldType: FieldTypeEnum.Text,
      field: {
        fieldType: FieldTypeEnum.Text,
      },
      next: {
        type: NextTypeEnum.Unary,
        id: 'end_1',
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
