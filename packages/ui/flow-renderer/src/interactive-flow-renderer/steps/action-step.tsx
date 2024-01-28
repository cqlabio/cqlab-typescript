import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {
  IActionStep,
  IFlowStepAnswer,
  AnswerTypeEnum,
  ActionStatusEnum,
} from '@cqlab/cqflow-core';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';

type ActionStepProps = {
  step: IActionStep;
  stepIndex: number;
  onUpdateAnswer: (stepId: string, answer: IFlowStepAnswer) => void;
};

export default function ActionStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: ActionStepProps) {
  const doneIds = Object.keys(step.statuses).filter(
    (key) => step.statuses[key] === ActionStatusEnum.Success
  );

  const [isEdit, setIsEdit] = useState(
    doneIds.length < step.nodeDefinition.min
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(doneIds);

  const addAction = (actionId: string) => {
    const nextIds = [...selectedIds, actionId];

    if (nextIds.length >= step.nodeDefinition.min) {
      onUpdateAnswer(step.stepId, {
        answerType: AnswerTypeEnum.Action,
        submitted: nextIds,
      });
    }
    setSelectedIds(nextIds);
  };

  const actionsRequired = step.nodeDefinition.min - selectedIds.length;

  const selectedIdsSet = new Set(selectedIds);
  const isComplete = !!step.answer;

  return (
    <InteractiveStepWrapper stepIndex={stepIndex}>
      <Box
        sx={{
          paddingBottom: '15px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Box>{step.label}</Box>

        <Box sx={{ color: 'rgb(130,130,130)' }}>
          {isComplete ? 'Submitted' : `Actions Required: ${actionsRequired}`}
        </Box>
      </Box>

      <Box sx={{ fontSize: '15px' }}>
        {step.nodeDefinition.actions.map((action, index) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingBottom: '10px',
            }}
          >
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ paddingRight: '5px' }}>{index + 1})</Box>
              {action.label}
            </Box>
            {!isComplete && selectedIdsSet.has(action.id) && (
              <Box
                sx={{
                  color: '#0288d1',
                  border: '1px solid rgba(2, 136, 209, 0.5)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
              >
                Action Complete
              </Box>
            )}

            {!isComplete && !selectedIdsSet.has(action.id) && (
              <Button
                variant="contained"
                size="small"
                color="info"
                onClick={() => addAction(action.id)}
              >
                {action.actionType}
              </Button>
            )}

            {isComplete && selectedIdsSet.has(action.id) && (
              <Box
                sx={{
                  color: '#0288d1',
                  border: '1px solid rgba(2, 136, 209, 0.5)',
                  padding: '4px 6px',
                  borderRadius: '4px',
                }}
              >
                Action Complete
              </Box>
            )}

            {isComplete && !selectedIdsSet.has(action.id) && (
              <Button
                disabled
                variant="contained"
                size="small"
                color="info"
                onClick={() => addAction(action.id)}
              >
                {action.actionType}
              </Button>
            )}
          </Box>
        ))}

        {/* {step.actionStatus === ActionStatusEnum.Success ? (
  <Button variant="contained" disabled>
    Complete
  </Button>
) : (
  <Button variant="contained" onClick={onAction}>
    Take Action
  </Button>
)} */}
      </Box>
    </InteractiveStepWrapper>
  );
}
