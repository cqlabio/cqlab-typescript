import Box from '@mui/material/Box';
import first from 'lodash/first';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Button from '@mui/material/Button';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {
  IMultiOptionFieldStep,
  IMultiOptionAnswer,
  AnswerTypeEnum,
  IMultiOptionStep,
} from '@cqlab/cqflow-core';
import { useState } from 'react';

type OptionSelectStepProps = {
  step: IMultiOptionStep;
  onUpdateAnswer: (stepId: string, answer: IMultiOptionAnswer) => void;
  stepIndex: number;
};

export function MultiOptionView({
  step,
  onUpdateAnswer,
  stepIndex,
}: OptionSelectStepProps) {
  const [isEditMode, setIsEditMode] = useState(!step.answer);
  const [selectedIds, setSelectedIds] = useState(
    step.answer?.selectedIds || []
  );

  const handleSwitchChange = (optionId: string) => {
    if (selectedIds.includes(optionId)) {
      setSelectedIds(selectedIds.filter((id) => id !== optionId));
    } else {
      setSelectedIds(selectedIds.concat(optionId));
    }

    // if (step.answer?.selectedIds.includes(optionId)) {
    //   onUpdateAnswer(step.stepId, {
    //     answerType: AnswerTypeEnum.MultiOption,
    //     selectedIds: step.answer.selectedIds.filter((id) => id !== optionId),
    //   });
    // } else {
    //   onUpdateAnswer(step.stepId, {
    //     answerType: AnswerTypeEnum.MultiOption,
    //     selectedIds: step.answer?.selectedIds.concat(optionId) || [optionId],
    //   });
    // }
  };

  const onSubmit = () => {
    onUpdateAnswer(step.stepId, {
      answerType: AnswerTypeEnum.MultiOption,
      selectedIds: selectedIds,
    });
    setIsEditMode(false);
  };

  const onEdit = () => {
    setIsEditMode(true);
    setSelectedIds(step.answer?.selectedIds || []);
  };

  const selectedOpts = new Set(selectedIds);

  return (
    <InteractiveStepWrapper stepIndex={stepIndex}>
      <Box>
        <Box>
          <Box sx={{ paddingBottom: '5px' }}>{step.label}</Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {step.options.map((option) => (
              <Box sx={{ flexBasis: '50%' }}>
                <FormControlLabel
                  label={option.label}
                  disabled={!isEditMode}
                  control={
                    <Switch
                      color="info"
                      checked={selectedOpts.has(option.id)}
                      onChange={() => handleSwitchChange(option.id)}
                    />
                  }
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Box sx={{ paddingTop: '10px', textAlign: 'right' }}>
        {isEditMode ? (
          <Button
            onClick={onSubmit}
            variant="contained"
            size="small"
            color="info"
          >
            Submit
          </Button>
        ) : (
          <Button onClick={onEdit} variant="outlined" size="small" color="info">
            Edit
          </Button>
        )}
      </Box>

      {/* <SupportingEvidence
      cqlExecutionResults={executionStepUserDecision.supportingEvidence}
    /> */}
    </InteractiveStepWrapper>
  );
}
