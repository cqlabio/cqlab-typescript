import { BooleanNode } from './abstract/boolean-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';
import { ITrueFalseNode } from '../cqflow-definition/cqflow-definition';

// export interface IYesNoNode extends IBaseBooleanNode {
//   nodeType: NodeTypeEnum.YesNo;
// }

export class YesNoNode<C extends FlowContext = FlowContext> extends BooleanNode<
  C,
  ITrueFalseNode
> {
  nodeType = ImplementationNodeTypeEnum.YesNo;

  // implements IYesNoNode
  // nodeType: NodeTypeEnum.YesNo = NodeTypeEnum.YesNo;
}
