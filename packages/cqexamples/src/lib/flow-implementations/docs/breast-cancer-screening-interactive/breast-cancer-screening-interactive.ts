import { FHIRRetriever } from '@cqlab/cqdefine';
import { BreastCancerScreeningLibrary } from '../../../libraries';
import { BreastCancerScreeningContext } from './breast-cancer-screening-interactive-context';
import {
  InteractiveFlowImplementation,
  ExecNode,
  TernaryEnum,
  DefinitionNodeTypeEnum,
} from '@cqlab/cqflow-core';

// Create an enum for the node bindings defined in the flow definition
// These bindings are used to map a node definition to node implementation
enum BreastCancerScreeningEnum {
  is_female = 'is_female',
  is_over_45 = 'is_over_45_years_old',
  has_had_breast_cancer_screening_in_last_2_years = 'has_had_breast_cancer_screening_in_last_2_years',
}

// Create an ExecNode that uses the breastCancerScreeningLibrary library to
// make a calculation using patient data
class IsFemale extends ExecNode<BreastCancerScreeningContext> {
  override async evaluate(
    context: BreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.isFemale();
  }
}

class IsOver45 extends ExecNode<BreastCancerScreeningContext> {
  override async evaluate(
    context: BreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.isOver45();
  }
}

class HasHadBreastCancerScreeningInLast2Years extends ExecNode<BreastCancerScreeningContext> {
  override async evaluate(
    context: BreastCancerScreeningContext
  ): Promise<TernaryEnum> {
    return context.breastCancerScreeningLibrary.hadBreastCancerScreeningInLast2Years();
  }
}

// Instantiate the flow implementation and register the nodes
export const breastCancerScreeningImplementation =
  new InteractiveFlowImplementation<BreastCancerScreeningContext>();

breastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.is_female,
  (nodeDef) => new IsFemale(nodeDef)
);

breastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.is_over_45,
  (nodeDef) => new IsOver45(nodeDef)
);

breastCancerScreeningImplementation.registerTrueFalse(
  BreastCancerScreeningEnum.has_had_breast_cancer_screening_in_last_2_years,
  (nodeDef) => new HasHadBreastCancerScreeningInLast2Years(nodeDef)
);


interface InitalP {
  patientId: string

}

class TempContext<I,L > {
  libraryManager: L
  initialData: I

  constructor(i : I, l: L) {
    this.initialData =i
    this.libraryManager = l
  }

  getInitialData() : I {
    return this.initialData
  }

  hello() {
    return 'hello'
  }
}

class NewTrueFalseNode<T> {
  public setEvaluator(callback: (context: T) => Promise<TernaryEnum>) {
    return callback
  }
}

class FlowImplemenation<I, L> {

  // context: TempContext<I>
  // // TempContext<I>

  // constructor () {
  //   this.context = new TempContext()
  // }

  public createTrueFalseNode(binding: string) {
    return new NewTrueFalseNode<TempContext<I, L>>()
  }
}

class LibraryManager {
  
  breastCancerScreeningLibrary: BreastCancerScreeningLibrary

  constructor(retriever: FHIRRetriever) {
    this.breastCancerScreeningLibrary = new BreastCancerScreeningLibrary(retriever)
  }
  // breastCancerScreeningLibrary() {
  //   isFemale: () => {
  //     return TernaryEnum.TRUE
  //   }
  // }
}

// class FlowFactory<I, C> {
//   public createTrueFalseNode(bindId: string) {
//     return new NewTrueFalseNode<C>()
//   }

//   public createFlowImplementation(initialData: I) {
//     return new FlowImplemenation<C>()
//   }

// }

const initialDataSchema = null

const fi = new FlowImplemenation<InitalP, LibraryManager>()

const isFemale = fi.createTrueFalseNode(BreastCancerScreeningEnum.is_female)

isFemale.setEvaluator(async (context) => {
  return context.libraryManager.breastCancerScreeningLibrary.isFemale()
})


const thing = new ExecNode<BreastCancerScreeningContext>({
  nodeType: DefinitionNodeTypeEnum.TrueFalse,
  id: '1',
  label: 'sd'
}) 

thing.setExecutor(async (context) => {
  return context.breastCancerScreeningLibrary.isFemale()
})


