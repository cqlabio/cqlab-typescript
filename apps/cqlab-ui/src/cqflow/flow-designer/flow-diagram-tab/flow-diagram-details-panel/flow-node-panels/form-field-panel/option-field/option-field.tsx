import { useContext } from 'react';
import Box from '@mui/material/Box';
import { IFieldOption, IMultiOptionFieldNode } from '@cqlab/cqflow-core';
import { NodeTypeWithDelete } from '../../../common/node-type-with-delete';
import { PanelLabel } from '../../../common/panel-label';

import { EditSelectOption } from './edit-select-options';
import { BranchChoiceCreateOption } from '../../branchchoice-panel/branchchoice-create-option';
import { getCustomNanoId } from '../../../../flow-diagram/node-templates';
import { MinMax, OptionMinMax } from './option-min-max';
import { FlowDesignerContext } from '../../../../../flow-designer-context';

type OptionSelectPanelProps = {
  node: IMultiOptionFieldNode;
};

export function OptionField({ node }: OptionSelectPanelProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onAddOption = (label: string) => {
    const id = getCustomNanoId('option');

    const nextNode: IMultiOptionFieldNode = {
      ...node,
      field: {
        ...node.field,
        options: [
          ...node.field.options,
          {
            id: id,
            label: label,
            bindId: id,
          },
        ],
      },
    };

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  const onUpdateOption = (nextOption: IFieldOption) => {
    const nextNode: IMultiOptionFieldNode = {
      ...node,
      field: {
        ...node.field,
        options: node.field.options.map((o) => {
          if (o.id === nextOption.id) {
            return nextOption;
          }
          return { ...o };
        }),
      },
    };

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  const onUpdateMinMax = (minMaxNode: MinMax) => {
    const nextNode: IMultiOptionFieldNode = {
      ...node,
      field: {
        ...node.field,
        ...minMaxNode,
      },
    };
    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  return (
    <>
      <PanelLabel label="Options" />

      {node.field.options?.map((option, index) => (
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
      <OptionMinMax node={node.field} onUpdateMinMax={onUpdateMinMax} />
    </>
  );
}
