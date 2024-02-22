import Box from '@mui/material/Box';
import { EditableTextRow } from '../../common/editable-text-row';
import { IAction, IFieldOption } from '@cqlab/cqflow-core';

type ActionListItemProps = {
  action: IAction;
  choiceIndex: number;
  onUpdateOption: (option: IFieldOption) => void;
};

export function ActionListItem({
  action,
  choiceIndex,
  onUpdateOption,
}: ActionListItemProps) {
  const onUpdateLabel = (nextLabel: string) => {
    // onUpdateOption({
    //   ...option,
    //   label: nextLabel
    // })
  };

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'flex-start', marginBottom: '3px' }}
    >
      <Box
        sx={{
          color: 'rgb(130,130,130)',
          marginRight: '3px',
          fontSize: '15px',
          marginTop: '2px',
        }}
      >
        {choiceIndex + 1})
      </Box>
      <Box
        sx={{
          background: '#E1F5FE',
          border: '1px solid #81D4FA',
          color: '#0D47A1',
          padding: '0 5px',
          borderRadius: '4px',
          fontSize: '13px',
          marginTop: '2px',
        }}
      >
        {action.actionType}
      </Box>
      <Box sx={{ paddingLeft: '5px', flexGrow: 1 }}>
        <EditableTextRow
          value={action.label || ''}
          onSaveValue={onUpdateLabel}
        />
      </Box>
    </Box>
  );
}
