import { IYesNoAnswer } from './yes-no-answer';
import { IActionAnswer } from './action-answer';
import { IOptionAnswer } from './option-answer';
import { ITextAnswer } from './text-answer';
import { ICustomDataAnswer } from './custom-data-answer';
import { IMultiOptionAnswer } from './multi-option-answer';

export * from './yes-no-answer';
export * from './action-answer';
export * from './option-answer';
export * from './text-answer';
export * from './custom-data-answer';
export * from './multi-option-answer';

export type FlowStepAnswer =
  | IYesNoAnswer
  | IActionAnswer
  | IOptionAnswer
  | ITextAnswer
  | ICustomDataAnswer
  | IMultiOptionAnswer;

// export {
//   FlowStepAnswer,
//   // YesNoAnswer,

// } ;
