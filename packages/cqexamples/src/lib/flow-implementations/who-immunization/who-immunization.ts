import {
  FlowContext,
  InteractiveFlowImplementation,
  SubFlowNode,
} from '@cqlab/cqflow-core';
import { WHOImmunizationContext } from './who-immunization-context';

class HepatitisBSubFlowNode extends SubFlowNode<WHOImmunizationContext> {
  override async getSubFlowContext(
    context: WHOImmunizationContext
  ): Promise<FlowContext<any, any>> {
    // const subflowContext = new HepatitisBContext(context.initialData);
    return context;
  }
}

export const whoImmunizationImplementation =
  new InteractiveFlowImplementation<WHOImmunizationContext>();

// whoImmunizationImplementation.registerSubFlow()
