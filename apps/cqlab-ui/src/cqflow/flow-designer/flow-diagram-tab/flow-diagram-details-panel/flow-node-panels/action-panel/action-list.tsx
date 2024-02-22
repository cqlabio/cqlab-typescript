import { useContext } from 'react';
import Box from '@mui/material/Box';
import {
  ActionEnum,
  IAction,
  IActionNode,
  IFieldOption,
  IMultiOptionNode,
} from '@cqlab/cqflow-core';
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
import { CreateNewAction } from './create-new-action';
import { ActionListItem } from './action-list-item';
import { ActionMin } from './action-min';
import { number } from 'zod';

type ActionListProps = {
  node: IActionNode;
};

export function ActionList({ node }: ActionListProps) {
  const { doNodeUpdates } = useContext(FlowDesignerContext);

  const onCreateAction = (actionType: ActionEnum, label: string) => {
    const id = getCustomNanoId('action');

    const nextNode: IActionNode = {
      ...node,
      actions: [
        ...node.actions,
        {
          actionType: actionType,
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
    // const nextNode: IMultiOptionNode = {
    //   ...node,
    //   options: node.options.map(o => {
    //     if (o.id === nextOption.id) {
    //       return nextOption
    //     }
    //     return {...o}
    //   })
    // }
    // doNodeUpdates({
    //   op: 'update',
    //   node: nextNode,
    // });
  };

  const onUpdateMin = (min: number) => {
    const nextNode: IActionNode = {
      ...node,
      min: min,
    };

    doNodeUpdates({
      op: 'update',
      node: nextNode,
    });
  };

  return (
    <>
      <PanelLabel label="Actions" />

      {node.actions?.map((action, index) => (
        <ActionListItem
          key={index}
          action={action}
          choiceIndex={index}
          onUpdateOption={onUpdateOption}
        />
      ))}

      <CreateNewAction onCreateAction={onCreateAction} />

      <PanelLabel label="Option Config" />
      <ActionMin node={node} onUpdateMin={onUpdateMin} />
      {/* <OptionMinMax node={node} onUpdateMinMax={onUpdateMinMax} /> */}
      {/* <OptionMinMax node={node} /> */}
    </>
  );
}
