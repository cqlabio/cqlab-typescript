import Box from '@mui/material/Box';
import IExecStep from './steps/exec-step';
import IYesNoStep from './steps/yesno-step';
import IActionStep from './steps/action-step';
import { EmitDataStepView } from './steps/emitdata-step';
import { BranchChoiceStepView } from './steps/branch-choice-step';
import { NarrativeStepView } from './steps/narrative-step';
import { CustomDataInputStepView } from './steps/custom-data-input';
import { EndStepView } from './steps/end-step';
import { MultiOptionFieldView } from './steps/option-field-step';
import { TextFieldStepView } from './steps/text-field-step';
import { NumberFieldStepView } from './steps/number-field-step';

import {
  IFlowStep,
  IFlowStepAnswer,
  ImplementationNodeTypeEnum,
} from '@cqlab/cqflow-core';
import { MultiOptionView } from './steps/multi-option-step';

type StepRouterProps = {
  steps: IFlowStep[];
  onUpdateAnswer: (stepId: string, answer: IFlowStepAnswer) => void;
};

export function InteractiveFlowRenderer({
  steps,
  onUpdateAnswer,
}: StepRouterProps) {
  let stepIndex = -1;

  const stepViews = steps.map((step) => {
    // const definition = graphData[step.stepId]

    stepIndex += 1;

    let result = null;

    if (step.stepType === ImplementationNodeTypeEnum.Start) {
      result = null;
    } else if (step.stepType === ImplementationNodeTypeEnum.YesNo) {
      result = (
        <IYesNoStep
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    }
    // else if (step.stepType === ImplementationNodeTypeEnum.Message) {
    //   result = <MessageStepView step={step} />;
    // }
    else if (step.stepType === ImplementationNodeTypeEnum.Exec) {
      result = (
        <IExecStep
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.MultiOptionExec) {
      result = (
        <MultiOptionView
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.Action) {
      result = <IActionStep stepIndex={stepIndex} step={step} onUpdateAnswer={onUpdateAnswer} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.EmitData) {
      result = <EmitDataStepView stepIndex={stepIndex} step={step} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.Narrative) {
      result = <NarrativeStepView stepIndex={stepIndex} step={step} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.BranchChoice) {
      result = (
        <BranchChoiceStepView
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.CustomForm) {
      result = (
        <CustomDataInputStepView
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.End) {
      result = <EndStepView stepIndex={stepIndex} step={step} />;
    } else if (step.stepType === ImplementationNodeTypeEnum.TextField) {
      result = (
        <TextFieldStepView
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.NumberField) {
      result = (
        <NumberFieldStepView
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else if (step.stepType === ImplementationNodeTypeEnum.MultiOptionField) {
      result = (
        <MultiOptionFieldView
          stepIndex={stepIndex}
          step={step}
          onUpdateAnswer={onUpdateAnswer}
        />
      );
    } else {
      result = (
        <div>IFlowStep View Not Found: {JSON.stringify(step, null, 2)}</div>
      );
    }

    // const isLast = false; //index === steps.length - 1;

    return <Box key={step.stepId}>{result}</Box>;
    // return (
    //   <Box>
    //     <Box
    //       sx={{
    //         paddingLeft: '24px',
    //         color: 'rgb(100,100,100)',
    //         fontWeight: 300,
    //         marginTop: '15px',
    //         textTransform: 'uppercase',
    //         fontSize: '13px',
    //         marginBottom: '3px',
    //       }}
    //     >
    //       Step {stepIndex}
    //     </Box>
    //     <Paper
    //       key={step.stepId}
    //       elevation={isLast ? 1 : 1}
    //       sx={{
    //         // marginTop: isLast ? '5px' : 0,
    //         background:
    //           step.stepType === ImplementationNodeTypeEnum.EmitData
    //             ? '#FFECB3'
    //             : '',
    //         marginLeft: '20px',
    //         marginRight: '20px',
    //         padding: '15px',
    //         borderBottom: '1px solid rgba(230,230,230, 0.5)',
    //       }}
    //     >
    //       <Box sx={{ display: 'flex' }}>
    //         <Box sx={{ flexGrow: 1 }}>{result}</Box>
    //       </Box>
    //     </Paper>
    //   </Box>
    // );
  });

  return <Box>{stepViews}</Box>;
}
