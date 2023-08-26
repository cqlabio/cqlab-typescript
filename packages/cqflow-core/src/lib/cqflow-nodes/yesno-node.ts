import { BooleanNode } from './abstract/boolean-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';

// export interface IYesNoNode extends IBaseBooleanNode {
//   nodeType: NodeTypeEnum.YesNo;
// }

export class YesNoNode<C extends FlowContext> extends BooleanNode<C> {
  nodeType = ImplementationNodeTypeEnum.YesNo;

  // implements IYesNoNode
  // nodeType: NodeTypeEnum.YesNo = NodeTypeEnum.YesNo;
}
