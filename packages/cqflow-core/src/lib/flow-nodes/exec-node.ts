import { BooleanNode } from './abstract/boolean-node';
import { ImplementationNodeTypeEnum, TernaryEnum } from '../enums';
import { FlowContext } from '../flow-context/flow-context';
import { IFlowDefinitionNode, ITrueFalseNode } from '../flow-definition';
// interface IExecNode extends IBaseBooleanNode {
//   nodeType: NodeTypeEnum.Exec;
// }

export type ExecNodeExecutor<C extends FlowContext> = (
  context: C
) => TernaryEnum;

export type SupplementalDataResolver<C extends FlowContext> = (
  context: C
) => any;

export class ExecNode<C extends FlowContext = FlowContext> extends BooleanNode<
  C,
  ITrueFalseNode
> {
  // nodeType: NodeTypeEnum.Exec = NodeTypeEnum.Exec;

  nodeType = ImplementationNodeTypeEnum.Exec;

  private executor?: ExecNodeExecutor<C>;
  private supplementalDataResolver?: SupplementalDataResolver<C>;

  constructor(node: ITrueFalseNode) {
    super(node);
    this.defintion = node;
  }

  setExecutor(executor: ExecNodeExecutor<C>) {
    this.executor = executor;
  }

  getExecutor(): ExecNodeExecutor<C> | null {
    return this.executor || null;
  }

  async evaluate(context: C): Promise<TernaryEnum> {
    if (this.executor) {
      return this.executor(context);
    }

    return TernaryEnum.UNKNOWN;
  }

  setSupplementalDataResolver(resolver: SupplementalDataResolver<C>) {
    this.supplementalDataResolver = resolver;
  }

  getSupplementalDataResolver(): SupplementalDataResolver<C> | null {
    return this.supplementalDataResolver || null;
  }

  async resolveSupplementalData(context: C): Promise<any> {
    return null;
  }
}
