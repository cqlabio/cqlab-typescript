import Box from '@mui/material/Box';
import { EditableTextRow } from '../../../common/editable-text-row';
import { IFieldOption } from '@cqlab/cqflow-core';

type EditUserDecisionFlowNodeProps = {
  option: IFieldOption;
  choiceIndex: number;
  onUpdateOption: (option: IFieldOption) => void;
};

export function EditSelectOption({
  option,
  choiceIndex,
  onUpdateOption,
}: EditUserDecisionFlowNodeProps) {
  const onUpdateLabel = (nextLabel: string) => {
    onUpdateOption({
      ...option,
      label: nextLabel,
    });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{ color: 'rgb(130,130,130)', marginRight: '3px', fontSize: '15px' }}
      >
        {choiceIndex + 1})
      </Box>
      <Box sx={{ paddingLeft: '5px', flexGrow: 1 }}>
        <EditableTextRow
          value={option.label || ''}
          onSaveValue={onUpdateLabel}
        />
      </Box>
    </Box>
  );
}
