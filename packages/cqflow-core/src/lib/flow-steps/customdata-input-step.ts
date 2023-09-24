import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { ICustomDataAnswer } from './answers/custom-data-answer';
import { JSONSchema7 } from 'json-schema';
import { IInputDataNode } from '../flow-definition/flow-definition';

export interface CustomDataInputStep extends BaseStep<IInputDataNode> {
  stepType: ImplementationNodeTypeEnum.CustomDataInput;
  answer: ICustomDataAnswer | null;
  jsonSchema: JSONSchema7;
}
