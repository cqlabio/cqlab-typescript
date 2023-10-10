import { DefinitionNodeTypeEnum, FieldTypeEnum } from '../enums';
import { IBaseNextNode } from './flow-definition-node';

export interface IFormFieldNodeBase<T, F extends FieldTypeEnum>
  extends IBaseNextNode {
  nodeType: DefinitionNodeTypeEnum.FormField;
  fieldType: F;
  field: T;
}

export interface ITextField {
  fieldType: FieldTypeEnum.Text;
}

export interface INumberField {
  fieldType: FieldTypeEnum.Number;
}

export interface IFieldOption {
  id: string;
  label: string;
  bindId?: string;
}

export interface IMultiOptionField {
  fieldType: FieldTypeEnum.MultiOption;
  options: IFieldOption[];
  min: number;
  max: number | null;
}

export type ITextFieldNode = IFormFieldNodeBase<ITextField, FieldTypeEnum.Text>;
export type INumberFieldNode = IFormFieldNodeBase<
  INumberField,
  FieldTypeEnum.Number
>;
export type IMultiOptionFieldNode = IFormFieldNodeBase<
  IMultiOptionField,
  FieldTypeEnum.MultiOption
>;

export type IFormFieldNode =
  | ITextFieldNode
  | INumberFieldNode
  | IMultiOptionFieldNode;
