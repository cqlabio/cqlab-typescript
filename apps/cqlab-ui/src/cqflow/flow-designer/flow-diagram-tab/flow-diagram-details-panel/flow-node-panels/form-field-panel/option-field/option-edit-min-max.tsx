import { useState, useContext } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { FlowDesignerContext } from '../../../../../flow-designer-context';

import { IMultiOptionFieldNode } from '@cqlab/cqflow-core';

enum MinMaxEnum {
  ExactlyOne = 'ExactlyOne',
  Any = 'Any',
  Custom = 'Custom',
}
interface MinMax {
  min: number;
  max: number | null;
}

function getOptionFromMinMax(node: MinMax): MinMaxEnum {
  if (node.min === 1 && node.max === 1) {
    return MinMaxEnum.ExactlyOne;
  } else if (node.min === 0 && node.max === null) {
    return MinMaxEnum.Any;
  }
  return MinMaxEnum.Custom;
}

type OptionEditMinMaxProps = {
  node: MinMax;
  toggleEdit: () => void;
  onUpdateMinMax: (node: MinMax) => void;
};

export function OptionEditMinMax({
  node,
  toggleEdit,
  onUpdateMinMax,
}: OptionEditMinMaxProps) {
  const [selectedOption, setSelectedOption] = useState<MinMaxEnum>(
    getOptionFromMinMax(node)
  );

  // const [current, setCurrent] = useState<IMultiOptionFieldNode>(node);

  // const { doNodeUpdates } = useContext(FlowDesignerContext);

  const handleRadioChange = (e: any, val: string) => {
    setSelectedOption(val as MinMaxEnum);
  };

  const onUpdate = () => {
    const nextNode = cloneDeep(node);

    if (selectedOption === MinMaxEnum.ExactlyOne) {
      nextNode.min = 1;
      nextNode.max = 1;
    } else if (selectedOption === MinMaxEnum.Any) {
      nextNode.min = 0;
      nextNode.max = null;
    }

    onUpdateMinMax(nextNode);
    // doNodeUpdates({
    //   op: 'update',
    //   node: nextNode,
    // });

    toggleEdit();
  };

  return (
    <Box>
      <FormControl>
        {/* <FormLabel id="demo-radio-buttons-group-label">Choose</FormLabel> */}
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={selectedOption}
          onChange={handleRadioChange}
        >
          <FormControlLabel
            value={MinMaxEnum.ExactlyOne}
            control={<Radio size="small" />}
            label="Select exactly one option"
          />
          <FormControlLabel
            value={MinMaxEnum.Any}
            control={<Radio size="small" />}
            label="Select any number of options"
          />
          <FormControlLabel
            value={MinMaxEnum.Custom}
            control={<Radio size="small" />}
            label="Customize number of options"
          />
        </RadioGroup>
      </FormControl>
      <Box sx={{ marginTop: '5px' }}>
        <Button size="small" variant="contained" onClick={onUpdate}>
          Finish
        </Button>
        <Button
          sx={{ marginLeft: '5px' }}
          onClick={toggleEdit}
          size="small"
          color="secondary"
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
