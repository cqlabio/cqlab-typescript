import { NextNode } from './abstract/next-node';
import { ImplementationNodeTypeEnum } from '../enums';
import { FlowContext } from '../cqflow-context/cqflow-context';
import { IEmitDataNode } from '../cqflow-definition/cqflow-definition';

// interface IEmitDataNode extends IBaseNextNode {
//   nodeType: NodeTypeEnum.ContextData;
//   dataItems: any[];
// }

export type ContextDataHook<C extends FlowContext> = (context: C) => void;

// export type RegisterContextData<S, C> = (data: S, context: C) => void;

// export type AlsoRegisterContextData<S, C> = () => (register: RegisterContextData<S>, context: C) => void;

export class EmitDataNode<
  C extends FlowContext<any, S>,
  S
> extends NextNode<C> {
  // implements IEmitDataNode

  nodeType = ImplementationNodeTypeEnum.EmitData;

  constructor(node?: IEmitDataNode) {
    super(node);
  }

  // nodeType: NodeTypeEnum.ContextData = NodeTypeEnum.ContextData;

  dataItems: S[] = [];

  // hook: RegisterContextData<S, C> | null = null;

  // constructor(node: IEmitDataNode) {
  //   super(node);
  // }

  // addDataToContext(context: C) {
  //   this.registerContextData(this.addContextData, context);

  //   const items = this.getContextData();
  //   items.forEach((item) => {
  //     context.addToContextDataStack(this, item);
  //   })
  // }

  // private addContextData: RegisterContextData<S> = (item: S) => {
  //   this.dataItems.push(item);
  // };

  async getContextData(context: C): Promise<S[]> {
    // if (this.hook) {
    //   this.hook(this.dataItems, context);
    // }
    return this.dataItems;
  }

  // registerContextData () {
  //   return;
  // }

  // setHook(hook: RegisterContextData<S, C>) {
  //   this.hook = hook;
  // }

  // getHook(): RegisterContextData<S, C> | null {
  //   return this.hook || null;
  // }
}
