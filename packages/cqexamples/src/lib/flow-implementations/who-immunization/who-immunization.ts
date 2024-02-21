import {
  FlowContext,
  InteractiveFlowImplementation,
  SubFlowNode,
} from '@cqlab/cqflow-core';
import { WHOImmunizationContext } from './who-immunization-context';
import { WHOImmunizationHepBContext } from './hepatitis-b-context';

class HepatitisBSubFlowNode extends SubFlowNode<WHOImmunizationContext> {
  override async getSubFlowContext(
    context: WHOImmunizationContext
  ): Promise<FlowContext<any, any>> {
    const subflowContext = new WHOImmunizationHepBContext({
      flowDefinitionId: this.getSubFlowId() as string,
      flowDefinitionRetriever: context.getFlowDefinitionRetriever(),
      interactiveFlowState: context.interactiveFlowState,
      onUpdateInteractiveState: context.onUpdateInteractiveState,
      initialData: {
        patientId: context.getInitialData().patientId,
      },
    });

    return context;
  }
}

export const whoImmunizationImplementation =
  new InteractiveFlowImplementation<WHOImmunizationContext>();

// whoImmunizationImplementation.registerSubFlow()
