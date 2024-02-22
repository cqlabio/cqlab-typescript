import Box from '@mui/material/Box';
import first from 'lodash/first';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {
  IMultiOptionFieldStep,
  IMultiOptionAnswer,
  AnswerTypeEnum,
} from '@cqlab/cqflow-core';

type OptionSelectStepProps = {
  step: IMultiOptionFieldStep;
  onUpdateAnswer: (stepId: string, answer: IMultiOptionAnswer) => void;
  stepIndex: number;
};

export function MultiOptionFieldView({
  step,
  onUpdateAnswer,
  stepIndex,
}: OptionSelectStepProps) {
  // const value = Number.isInteger(step?.answer?.value)
  //   ? step.options[step?.answer?.value as number].id
  //   : null;

  // const value = null;

  const handleSelectChange = function (event: SelectChangeEvent) {
    const selectedId = event.target.value as string;
    const found = step.options.find((o) => o.id === selectedId);

    if (found) {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.MultiOption,
        selectedIds: [selectedId],
      });
    } else {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.MultiOption,
        selectedIds: [],
      });
    }
  };

  const handleSwitchChange = (optionId: string) => {
    if (step.answer?.selectedIds.includes(optionId)) {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.MultiOption,
        selectedIds: step.answer.selectedIds.filter((id) => id !== optionId),
      });
    } else {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.MultiOption,
        selectedIds: step.answer?.selectedIds.concat(optionId) || [optionId],
      });
    }
  };

  const selectedOpts = new Set(step.answer?.selectedIds || []);
  const isSingleSelect = step.min === 1 && step.max === 1;

  const selectValue =
    (isSingleSelect && first(step.answer?.selectedIds || [])) || '';
  return (
    <InteractiveStepWrapper stepIndex={stepIndex}>
      <Box>
        {isSingleSelect ? (
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }}>{step.label}</Box>

            <Box sx={{ maxWidth: '35%', paddingRight: '0px' }}>
              <Select
                fullWidth
                value={selectValue}
                onChange={handleSelectChange}
                sx={{ minWidth: '100px', background: 'white' }}
                size="small"
                placeholder="heheheh"
                displayEmpty
              >
                <MenuItem
                  value=""
                  sx={{ color: 'rgb(120,120,120)', fontStyle: 'italic' }}
                >
                  Choose One
                </MenuItem>
                {step.options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box sx={{ paddingBottom: '5px' }}>{step.label}</Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {step.options.map((option) => (
                <Box sx={{ flexBasis: '50%' }}>
                  <FormControlLabel
                    label={option.label}
                    control={
                      <Switch
                        checked={selectedOpts.has(option.id)}
                        onChange={() => handleSwitchChange(option.id)}
                      />
                    }
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* <SupportingEvidence
      cqlExecutionResults={executionStepUserDecision.supportingEvidence}
    /> */}
    </InteractiveStepWrapper>
  );
}
