import { IYesNoAnswer } from './yes-no-answer';
import { IActionAnswer } from './action-answer';
import { IIndexAnswer } from './index-answer';
import { ITextAnswer } from './text-answer';
import { ICustomDataAnswer } from './custom-data-answer';

export * from './yes-no-answer';
export * from './action-answer';
export * from './index-answer';
export * from './text-answer';
export * from './custom-data-answer';

export type FlowStepAnswer =
  | IYesNoAnswer
  | IActionAnswer
  | IIndexAnswer
  | ITextAnswer
  | ICustomDataAnswer;

// export {
//   FlowStepAnswer,
//   // YesNoAnswer,

// } ;
