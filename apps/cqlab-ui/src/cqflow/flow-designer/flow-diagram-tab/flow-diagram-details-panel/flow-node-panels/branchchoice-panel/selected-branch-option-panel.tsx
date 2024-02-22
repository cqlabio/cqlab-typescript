import { ReactNode, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useFlowStore } from '../../../../../flow-store';
import { INextMultiOption } from '@cqlab/cqflow-core';

import { PanelLabel } from '../../common/panel-label';

import { PanelWrapper } from '../../common/panel-wrapper';
import { EditableTextRow } from '../../common/editable-text-row';
import { validateNodeBindId } from '../../../../../../data/validation';

type SelectedBranchOptionProps = {
  option: INextMultiOption;
  updateOption: (option: INextMultiOption) => void;
};

export function SelectedBranchOptionPanel({
  option,
  updateOption,
}: SelectedBranchOptionProps) {
  const setSelectedBranchOptionId = useFlowStore(
    (state) => state.setSelectedBranchOptionId
  );

  const onUpdateLabel = (label: string) => {
    updateOption({
      ...option,
      label,
    });
  };

  const onUpdateBindId = (bindId: string) => {
    updateOption({
      ...option,
      bindId,
    });
  };

  const bindIdValidator = (bindId: string): string | null => {
    if (!validateNodeBindId(bindId)) {
      return 'Bind id must have lowercase letters, numbers, underscores only. For example: my_id_1';
    }
    return null;
  };

  return (
    <Box>
      <Box
        sx={{
          background: 'rgb(240,240,240)',
          cursor: 'pointer',
          padding: '7px',
          borderBottom: '1px solid rgb(230,230,230)',
        }}
      >
        <Button
          variant="contained"
          size="small"
          onClick={() => setSelectedBranchOptionId(null)}
        >
          {'< Back'}
        </Button>
        {/* {'< Back'} */}
      </Box>

      <PanelWrapper label={option.id}>
        <PanelLabel label="Node Type" />
        <Box sx={{ color: 'secondary.main' }}>{'True/False'}</Box>

        <PanelLabel label="Label" />
        <EditableTextRow
          value={option.label || ''}
          onSaveValue={onUpdateLabel}
        />

        <PanelLabel label="Bind Id" />
        <EditableTextRow
          value={option.bindId || ''}
          onSaveValue={onUpdateBindId}
          validator={bindIdValidator}
        />
      </PanelWrapper>
    </Box>
  );
}
