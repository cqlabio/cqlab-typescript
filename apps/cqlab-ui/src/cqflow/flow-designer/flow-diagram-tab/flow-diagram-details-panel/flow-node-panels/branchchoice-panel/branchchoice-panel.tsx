import { useContext } from 'react';
import Box from '@mui/material/Box';
import {
  IBranchNode,
  INextMultiOption,
  NextTypeEnum,
} from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';
import { PanelNodeLabel } from '../../common/panel-node-label';
import { PanelWrapper } from '../../common/panel-wrapper';
import { PanelValidationSection } from '../../common/panel-validation-section';
import { PanelNodeId } from '../../common/panel-node-id';
// import { BranchChoicePanelEditChoice } from './branchchoice-panel-editchoice.old';
import { BranchPanelOption } from './branch-panel-option';
import { BranchChoiceCreateOption } from './branchchoice-create-option';
import { useFlowStore } from '../../../../../flow-store';
import { cloneDeep, update } from 'lodash';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import { getCustomNanoId } from '../../../flow-diagram/node-templates';
import { SliderPanel } from '../../common/slider-panel';
import { SelectedBranchOptionPanel } from './selected-branch-option-panel';

type BranchChoicePanelProps = {
  node: IBranchNode;
};

export function BranchChoiceDataPanel({ node }: BranchChoicePanelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);
  const selectedBranchOptionId = useFlowStore(
    (state) => state.selectedBranchOptionId
  );

  const onAddOption = (label: string) => {
    const nextNode = cloneDeep(node);

    if (!nextNode.next) {
      nextNode.next = {
        type: NextTypeEnum.Multi,
        options: [],
      };
    }

    const id = getCustomNanoId('branchoption');

    nextNode.next.options.push({
      id: id,
      bindId: id,
      label: label,
      toId: '',
    });

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  const onUpdateOption = (option: INextMultiOption) => {
    const nextNode = cloneDeep(node);
    if (!nextNode.next) {
      return;
    }

    nextNode.next.options = nextNode.next.options.map((o) => {
      if (o.id === option.id) {
        return option;
      }
      return o;
    });

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  const foundOption = node.next?.options.find(
    (o) => o.id === selectedBranchOptionId
  );

  const leftPanelContent = (
    <PanelWrapper label={node.id}>
      <PanelLabel label="Node Type" />
      <NodeTypeWithDelete label="Branch" nodeId={node.id} />

      <PanelNodeLabel node={node} />
      <PanelNodeId node={node} />

      <PanelLabel label="Choices" />
      {node.next?.options.map((option, index) => (
        <BranchPanelOption
          key={index}
          node={node}
          option={option}
          choiceIndex={index}
        />
      ))}
      <BranchChoiceCreateOption
        buttonLabel="Add Choice"
        onCreateOption={onAddOption}
      />

      <PanelValidationSection nodeId={node.id} />
    </PanelWrapper>
  );

  const rightPanelContent = !!foundOption && (
    <SelectedBranchOptionPanel
      option={foundOption}
      updateOption={onUpdateOption}
    />
  );

  return (
    <SliderPanel
      slideRight={!!foundOption}
      leftPanelContent={leftPanelContent}
      rightPanelContent={rightPanelContent}
    />
  );
}
