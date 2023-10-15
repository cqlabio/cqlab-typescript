export { HypertensionContext } from './hypertension-context';
import { HypertensionContext } from './hypertension-context';
import {
  InteractiveFlowImplementation,
  ExecNode,
  TernaryEnum,
  CustomFormNode,
} from '@cqlab/cqflow-core';
import { JSONSchema7 } from 'json-schema';

// Create an enum for the node bindings defined in the flow definition
// These bindings are used to map a node definition to node implementation
export enum BreastCancerScreeningEnum {
  enter_blood_pressure_panel = 'enter_blood_pressure_panel',

  systolic_bp_greater_180 = 'systolic_bp_greater_180',
  diastolic_greater_120 = 'diastolic_greater_120',

  systolic_bp_greater_equal_140 = 'systolic_bp_greater_equal_140',
  diastolic_bp_greater_equal_90 = 'diastolic_bp_greater_equal_90',

  systolic_greater_equal_130_less_140 = 'systolic_greater_equal_130_less_140',
  diastolic_greater_equal_80_less_90 = 'diastolic_greater_equal_80_less_90',

  systolic_greater_equal_120_less_130 = 'systolic_greater_equal_120_less_130',
}

export interface EnterBloodPressurePanelData {
  systolicReading: number;
  diastolicReading: number;
}

class EnterBloodPressurePanel extends CustomFormNode<
  HypertensionContext,
  EnterBloodPressurePanelData
> {
  override async getValue(
    context: HypertensionContext
  ): Promise<EnterBloodPressurePanelData | null> {
    const bloodPressurePanel =
      await context.hypertensionLibrary.getBloodPressurePanel();

    if (bloodPressurePanel) {
      return Promise.resolve({
        systolicReading: bloodPressurePanel.systolic.value,
        diastolicReading: bloodPressurePanel.diastolic.value,
      });
    }

    return null;
  }
  override getValueJsonSchema(): JSONSchema7 {
    return {
      type: 'object',
      properties: {
        systolicReading: {
          title: 'Systolic Reading',
          type: 'number',
        },
        diastolicReading: {
          title: 'Diastolic Reading',
          type: 'number',
          description: 'Units are pg/mL',
        },
      },
    };
  }
}

// Create an ExecNode that uses the breastCancerScreeningLibrary library to
// make a calculation using patient data
class SystolicGreater180 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.systolicReading > 180
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

class DiastolicGreater120 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.diastolicReading > 120
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

class SystolicGreaterEqual140 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.systolicReading >= 140
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

class DiastolicGreaterEqual90 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.diastolicReading >= 90
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

class SystolicGreaterEqual130Less140 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.systolicReading >= 130 &&
      bloodPressurePanel.systolicReading < 140
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

class DiastolicGreaterEqual80Less90 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.diastolicReading >= 80 &&
      bloodPressurePanel.diastolicReading < 90
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

class SystolicGreaterEqual120Less130 extends ExecNode<HypertensionContext> {
  override async evaluate(context: HypertensionContext): Promise<TernaryEnum> {
    const bloodPressurePanel = await context.getBloodPressurePanel();
    if (!bloodPressurePanel) {
      return TernaryEnum.UNKNOWN;
    }
    return bloodPressurePanel.systolicReading >= 120 &&
      bloodPressurePanel.systolicReading < 130
      ? TernaryEnum.TRUE
      : TernaryEnum.FALSE;
  }
}

// Instantiate the flow implementation and register the nodes
export const hypertensionImplementation =
  new InteractiveFlowImplementation<HypertensionContext>();

hypertensionImplementation.registerCustomForm(
  BreastCancerScreeningEnum.enter_blood_pressure_panel,
  (nodeDef) => new EnterBloodPressurePanel(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.systolic_bp_greater_180,
  (nodeDef) => new SystolicGreater180(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.diastolic_greater_120,
  (nodeDef) => new DiastolicGreater120(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.systolic_bp_greater_equal_140,
  (nodeDef) => new SystolicGreaterEqual140(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.diastolic_bp_greater_equal_90,
  (nodeDef) => new DiastolicGreaterEqual90(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.systolic_greater_equal_130_less_140,
  (nodeDef) => new SystolicGreaterEqual130Less140(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.diastolic_greater_equal_80_less_90,
  (nodeDef) => new DiastolicGreaterEqual80Less90(nodeDef)
);

hypertensionImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.systolic_greater_equal_120_less_130,
  (nodeDef) => new SystolicGreaterEqual120Less130(nodeDef)
);
