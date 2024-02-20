import { InteractiveFlowImplementation } from "@cqlab/cqflow-core";
import { WHOImmunizationHepBContext } from "./hepatitis-b-context";




interface InputData {
  patientId: string;
}

interface OutputData {
  recommendation: string;
}

export const whoImmunizationHepatitisBImplementation =
  new InteractiveFlowImplementation<WHOImmunizationHepBContext>();

  whoImmunizationHepatitisBImplementation.registerLibraryManager(initialData => {
    return new LibraryManager(initialData);
  })