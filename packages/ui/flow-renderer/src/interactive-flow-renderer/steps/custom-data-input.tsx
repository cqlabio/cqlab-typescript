import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import {
  ICustomFormStep,
  AnswerTypeEnum,
  ICustomDataAnswer,
} from '@cqlab/cqflow-core';
import Form from '@rjsf/mui';
import { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { InteractiveStepWrapper } from './common/interactive-step-wrapper';
import { AutoResolvedLabel } from './common/auto-resolved-label';

type CustomDataInputStepProps = {
  step: ICustomFormStep;
  onUpdateAnswer: (stepId: string, answer: ICustomDataAnswer) => void;
  stepIndex: number;
};

export function CustomDataInputStepView({
  step,
  onUpdateAnswer,
  stepIndex,
}: CustomDataInputStepProps) {
  const [formData, setFormData] = useState(step.answer?.value || null);
  const [submitIsDisabled, setIsDisabled] = useState(!!step.answer);
  const [readOnly, setReadOnly] = useState(false);

  useEffect(() => {
    if (step.answer) {
      setFormData(step.answer?.value);
      setIsDisabled(true);
      setReadOnly(false);
    } else if (step.evaluation) {
      setFormData(step.evaluation?.value);
      setIsDisabled(true);
      setReadOnly(true);
    } else {
      setReadOnly(false);
      setFormData(null);
    }
  }, [step]);

  const onSubmit = (data: IChangeEvent, e: any) => {
    if (submitIsDisabled) {
      return;
    }
    const { formData } = data;

    onUpdateAnswer(step.stepId, {
      answerType: AnswerTypeEnum.CustomData,
      value: formData,
    });
  };

  const onChange = (e: IChangeEvent) => {
    if (submitIsDisabled) {
      setIsDisabled(false);
    }
    setFormData(e.formData);
  };

  const submitStyles = {
    float: 'right',
    // position: 'relative',
    // top: '0'
  };

  if (submitIsDisabled) {
    Object.assign(submitStyles, {
      background: 'rgba(60, 60, 60, 0.1)',
      color: 'rgb(130,130,130)',
      boxShadow: 0,
      cursor: 'not-allowed',
    });
  }
  const topRightLabel = readOnly && <AutoResolvedLabel />;

  return (
    <InteractiveStepWrapper stepIndex={stepIndex} topRightLabel={topRightLabel}>
      <Box sx={{ fontSize: '15px', '[type=submit]': submitStyles }}>
        <Box>{step.label}</Box>

        <Form
          schema={step.jsonSchema}
          validator={validator}
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          disabled={readOnly}
        />
      </Box>
    </InteractiveStepWrapper>
  );
}
