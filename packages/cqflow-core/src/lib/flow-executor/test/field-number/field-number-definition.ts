import { IFlowDefinition } from '../../../flow-definition';
import {
  NextTypeEnum,
  DefinitionNodeTypeEnum,
  FieldTypeEnum,
} from '../../../enums';

export const fieldNumberDef: IFlowDefinition = {
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
        id: 'field_number_1',
        type: NextTypeEnum.Unary,
      },
    },
    field_number_1: {
      id: 'field_number_1',
      bindId: 'field_number_1',
      label: 'Choose Option',
      nodeType: DefinitionNodeTypeEnum.FormField,
      fieldType: FieldTypeEnum.Number,
      field: {
        fieldType: FieldTypeEnum.Number,
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
