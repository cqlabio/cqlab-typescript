import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  INumberFieldStep,
  IFlowStepAnswer,
  AnswerTypeEnum,
  ActionStatusEnum,
} from '@cqlab/cqflow-core';
import TextField from '@mui/material/TextField';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import { AutoResolvedLabel } from './common/auto-resolved-label';

type NumberFieldStepProps = {
  step: INumberFieldStep;
  onUpdateAnswer: (stepId: string, answer: IFlowStepAnswer) => void;
  stepIndex: number;
};

export function NumberFieldStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: NumberFieldStepProps) {
  const [disabled, setDisabled] = useState(false);
  const [val, setVal] = useState<number | null>(null);

  const onUpdate = () => {
    onUpdateAnswer(step.stepId, {
      answerType: AnswerTypeEnum.Number,
      value: val || null,
    });
  };

  const onInputChange = (e: any) => {
    setVal(parseFloat(e.target.value));
  };

  useEffect(() => {
    if (step.answer) {
      setVal(step.answer.value || null);
      setDisabled(false);
    } else if (step.evaluation) {
      setVal(step.evaluation.value || null);
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [step]);

  // Should be able to add a null value
  const disabledButton = val && step.answer?.value === val;

  const topRightLabel = disabled && <AutoResolvedLabel />;

  return (
    <InteractiveStepWrapper stepIndex={stepIndex} topRightLabel={topRightLabel}>
      <Box sx={{ fontSize: '15px', display: 'flex' }}>
        <Box sx={{ flexGrow: 1 }}>{step.label}</Box>
        <Box sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                sx={{ margin: 0 }}
                value={val || ''}
                type="number"
                onChange={onInputChange}
                margin="dense"
                fullWidth
                variant="outlined"
                disabled={disabled}
                // color="secondary"
                size="small"
              />
            </Box>

            <Box sx={{ marginLeft: '5px' }}>
              <Button
                size="small"
                onClick={onUpdate}
                disabled={disabled || !!disabledButton}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </InteractiveStepWrapper>
  );
}
