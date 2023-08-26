import { compileNodes } from './utils';
import { IFlowDefintion } from '../cqflow-definition/cqflow-definition';
import { FlowContext } from '../cqflow-context/cqflow-context';
import { FlowImplementation } from '../cqflow-implementation/flow-implementation';
import {
  ExecNode,
  EmitDataNode,
  StartNode,
  EndNode,
  SubFlowNode,
  MessageNode,
  NarrativeNode,
} from '../cqflow-nodes';
import {
  FlowStep,
  StartStep,
  ExecStep,
  EndStep,
  ContextDataStep,
  MessageStep,
  NarrativeStep,
} from '../cqflow-steps';
import { ImplementationNodeTypeEnum, TernaryEnum } from '../enums';

export interface SubFlowExecution<C extends FlowContext<any, any>> {
  flowImplementation: FlowImplementation<C>;
  flowDefinition: IFlowDefintion;
}

export async function executeNonInteractive<C extends FlowContext<any, any>>(
  flowImplementation: FlowImplementation<C>,
  context: C,
  subFlows: null | Record<string, SubFlowExecution<C>> = {}
): Promise<FlowStep[]> {
  // TODO: is there a better way to give context access to this?
  // context.setFlowDefinition(flowImplementation.ge);

  const nodes = compileNodes(flowImplementation, context.getFlowDefinition());

  const keys = Object.keys(nodes);
  let startNode: StartNode<C> | null = null;

  for (const key of keys) {
    if (nodes[key] instanceof StartNode) {
      startNode = nodes[key] as StartNode<C>;
    }
  }

  const steps: FlowStep[] = [];

  async function recurseNode(
    nodeId: string | null,
    currentFlowDefinitionId: string
  ) {
    if (!nodeId || !nodes[nodeId]) {
      return;
    }

    const node = nodes[nodeId];

    const nextStep = {
      nodeId: nodeId,
      flowDefinitionId: currentFlowDefinitionId,
    };

    if (node instanceof StartNode) {
      const step: StartStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.Start,
        initialData: context.getInitialData(),
      };

      steps.push(step);
      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof EndNode) {
      const step: EndStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.End,
      };

      steps.push(step);
    } else if (node instanceof MessageNode) {
      const step: MessageStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.Message,
        label: node.getLabel(context),
      };

      steps.push(step);
      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof NarrativeNode) {
      const step: NarrativeStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.Narrative,
        label: node.getLabel(context),
        narrative: node.getLabel(context) || '',
      };

      steps.push(step);
      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof ExecNode) {
      const step: ExecStep = {
        ...nextStep,
        label: node.getLabel(context),
        stepType: ImplementationNodeTypeEnum.Exec,
        evaluation: TernaryEnum.UNKNOWN,
        answer: null,
        supplementalData: await node.resolveSupplementalData(context),
      };

      step.evaluation = await node.evaluate(context);

      steps.push(step);

      if (step.evaluation === TernaryEnum.TRUE) {
        await recurseNode(node.getOnTrueId(), currentFlowDefinitionId);
      } else {
        await recurseNode(node.getOnFalseId(), currentFlowDefinitionId);
      }
    } else if (node instanceof EmitDataNode) {
      const step: ContextDataStep = {
        ...nextStep,
        stepType: ImplementationNodeTypeEnum.EmitData,
        label: node.getLabel(context),
        contextData: node.getContextData(context),
      };

      for (const d of step.contextData) {
        context.addToContextDataStack(nodeId, d);
      }

      // node.addDataToContext(context)

      // const hook = node.getHook()
      // if (hook) {
      //   hook(context);
      // }

      steps.push(step);

      await recurseNode(node.getNextNodeId(), currentFlowDefinitionId);
    } else if (node instanceof SubFlowNode) {
      const subFlowId = node.getSubFlowId();

      if (!subFlows || !subFlows[subFlowId as string]) {
        throw new Error(`Subflow ${node.getDefinitionId()} not found`);
      }

      const {
        flowImplementation: subFlowImplementation,
        flowDefinition: subFlowDefinition,
      } = subFlows[subFlowId as string];

      // Get if it exists, else pass current context
      const subFlowContext = node.getSubFlowContext(context);

      const subResults = await executeNonInteractive(
        subFlowImplementation,
        subFlowContext || context,
        subFlows
      );

      steps.push(...subResults);

      await recurseNode(node.getNextNodeId(), subFlowDefinition.id);
    }
  }

  if (startNode) {
    await recurseNode(
      startNode.getDefinitionId(),
      context.getFlowDefinition().id
    );
  }

  return steps;
}
