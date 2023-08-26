// export * from './and-node';
// export * from './or-node';
// export * from './reference-node';

import { AndLogic } from './and-node';
import { OrLogic } from './or-node';
import { TrueFalseLeaf } from './truefalse-leaf';

// export type ILogicTreeItem = IAnd | IOr | ILogicReference;
export type LogicTreeItem = AndLogic | OrLogic | TrueFalseLeaf<any>;

// export type ILogic = IAnd | IOr;
export type Logic = AndLogic | OrLogic;
