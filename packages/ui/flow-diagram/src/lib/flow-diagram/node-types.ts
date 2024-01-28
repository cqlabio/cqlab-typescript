import { ComponentType } from 'react';
import { NodeProps } from 'reactflow';
import { DefinitionNodeTypeEnum } from '@cqlab/cqflow-core';

import { StartNode } from './flow-diagram-nodes/start-diagram-node';
import { TrueFalseDiagramNode } from './flow-diagram-nodes/truefalse-diagram-node';
import { LogicTreeDiagramNode } from './flow-diagram-nodes/logictree-diagram-node';
import { EmitDataDiagramNode } from './flow-diagram-nodes/emit-data-diagram-node';
// import { SubFlowNode } from './flow-diagram-nodes/subflow-node';
import { EndDiagramNode } from './flow-diagram-nodes/end-diagram-node';
import { ActionDiagramNode } from './flow-diagram-nodes/action-diagram-node';
import { NarrativeDiagramNode } from './flow-diagram-nodes/narrative-diagram-node';
import { CustomFormDiagramNode } from './flow-diagram-nodes/custom-form-diagram-node';
import { BranchChoiceDiagramNode } from './flow-diagram-nodes/branchchoice-diagram-node';
// import { MultiOptionFieldDiagramNode } from './flow-diagram-nodes/multi-option-field-node';
import { FormFieldDiagramNode } from './flow-diagram-nodes/form-field-node';
import { NoteDiagramNode } from './flow-diagram-nodes/note-node';

// import { FloatingEdge } from './flow-diagram-edges/floating-edge';
import { MultiOptionDiagramNode } from './flow-diagram-nodes/multi-option-node';

export const flowDiagramNodeTypes: Record<
  DefinitionNodeTypeEnum,
  ComponentType<NodeProps>
> = {
  [DefinitionNodeTypeEnum.Start]: StartNode,
  [DefinitionNodeTypeEnum.TrueFalse]: TrueFalseDiagramNode,
  [DefinitionNodeTypeEnum.LogicTree]: LogicTreeDiagramNode,
  [DefinitionNodeTypeEnum.EmitData]: EmitDataDiagramNode,
  [DefinitionNodeTypeEnum.MultiOption]: MultiOptionDiagramNode,
  // [DefinitionNodeTypeEnum.SubFlow]: SubFlowNode,
  [DefinitionNodeTypeEnum.End]: EndDiagramNode,
  [DefinitionNodeTypeEnum.Action]: ActionDiagramNode,
  [DefinitionNodeTypeEnum.Narrative]: NarrativeDiagramNode,
  [DefinitionNodeTypeEnum.Branch]: BranchChoiceDiagramNode,
  [DefinitionNodeTypeEnum.CustomForm]: CustomFormDiagramNode,
  [DefinitionNodeTypeEnum.FormField]: FormFieldDiagramNode,
  [DefinitionNodeTypeEnum.Note]: NoteDiagramNode,
};

export const flowDiagramEdgesTypes = {
  // floating: FloatingEdge,
};
