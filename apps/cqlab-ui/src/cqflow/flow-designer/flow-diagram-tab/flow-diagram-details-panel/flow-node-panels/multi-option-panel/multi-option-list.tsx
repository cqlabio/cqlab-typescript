import { useContext } from 'react';
import Box from '@mui/material/Box';
import { IFieldOption, IMultiOptionNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../common/node-type-with-delete';
import { PanelLabel } from '../../common/panel-label';

import { EditSelectOption } from '../form-field-panel/option-field/edit-select-options';
import { BranchChoiceCreateOption } from '../branchchoice-panel/branchchoice-create-option';
import { getCustomNanoId } from '../../../flow-diagram/node-templates';
import {
  MinMax,
  OptionMinMax,
} from '../form-field-panel/option-field/option-min-max';
import { FlowDesignerContext } from '../../../../flow-designer-context';
import { ActionMin } from '../action-panel/action-min';

type OptionSelectPanelProps = {
  node: IMultiOptionNode;
};

export function MultiOptionList({ node }: OptionSelectPanelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onAddOption = (label: string) => {
    const id = getCustomNanoId('option');

    const nextNode: IMultiOptionNode = {
      ...node,
      options: [
        ...node.options,
        {
          id: id,
          label: label,
          bindId: id,
        },
      ],
    };

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  const onUpdateOption = (nextOption: IFieldOption) => {
    const nextNode: IMultiOptionNode = {
      ...node,
      options: node.options.map((o) => {
        if (o.id === nextOption.id) {
          return nextOption;
        }
        return { ...o };
      }),
    };

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  const onUpdateMin = (val: number) => {
    const nextNode: IMultiOptionNode = {
      ...node,
      min: val,
    };

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  return (
    <>
      <PanelLabel label="Options" />

      {node.options?.map((option, index) => (
        <EditSelectOption
          key={index}
          option={option}
          choiceIndex={index}
          onUpdateOption={onUpdateOption}
        />
      ))}

      <BranchChoiceCreateOption
        buttonLabel="Add Choice"
        onCreateOption={onAddOption}
      />

      <PanelLabel label="Option Config" />
      <ActionMin node={node} onUpdateMin={onUpdateMin} />
      {/* <OptionMinMax node={node} onUpdateMinMax={onUpdateMinMax} /> */}
    </>
  );
}
