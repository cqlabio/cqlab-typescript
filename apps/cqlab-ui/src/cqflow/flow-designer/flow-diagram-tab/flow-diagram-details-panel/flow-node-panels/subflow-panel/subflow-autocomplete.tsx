import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useFlowDefinitions } from '../../../../../../data/queries';
import { FlowDesignerContext } from '../../../../flow-designer-context';

type SubFlowAutoCompleteProps = {
  subFlowId: string;
  onUpdateSubFlowId: (subFlowId: string | null) => void;
};

export function SubFlowAutoComplete({
  subFlowId,
  onUpdateSubFlowId,
}: SubFlowAutoCompleteProps) {
  const [inputValue, setInputValue] = React.useState('');

  const { data: flows = [] } = useFlowDefinitions();

  const bindIdToId: Record<string, string> = {};
  const idToBindId: Record<string, string> = {};

  flows.forEach((flow) => {
    if (flow.bindId) {
      idToBindId[flow.id] = flow.bindId;
      bindIdToId[flow.bindId] = flow.id;
    }
  });

  const options = Object.keys(bindIdToId);
  const currentValue = idToBindId[subFlowId] || '';

  return (
    <div>
      {/* <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div>
      <div>{`inputValue: '${inputValue}'`}</div> */}
      <br />
      <Autocomplete
        value={currentValue}
        onChange={(event: any, newValue: string | null) => {
          const newSubFlowId = newValue ? bindIdToId[newValue] : null;
          onUpdateSubFlowId(newSubFlowId);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={options}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="SubFlow" />}
      />
    </div>
  );
}
