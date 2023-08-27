import { BaseStep } from './base-step';
import { ImplementationNodeTypeEnum } from '../enums';
import { ICustomDataAnswer } from './answers/custom-data-answer';
import { JSONSchema7 } from 'json-schema';

export interface CustomDataInputStep extends BaseStep {
  stepType: ImplementationNodeTypeEnum.CustomDataInput;
  answer: ICustomDataAnswer | null;
  jsonSchema: JSONSchema7;
}
