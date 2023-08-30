import { Library, logic, documentation, params } from './logic-library-decorators';
import { LibraryContainer } from './logic-library-container'
import { z } from "zod";
import { LogicLibrary } from './logic-library'
import { TernaryEnum  } from "@cqlab/cqflow-core";


describe('packagesCqflowEvaluator', () => {
  it('should work', () => {

    const overAge = z.object({
      age: z.number(),
    });
    
    type OverAge = z.infer<typeof overAge>;
    
    interface InstantiateWith {
      patientId: string
    }
    
    @Library("HeartDisease")
    class HeartDiseaseLibrary extends LogicLibrary {
      
      @logic("Is Male")
      @documentation("Determines if gender is male")
      isMale (): TernaryEnum {
        return TernaryEnum.TRUE;
      }

      @logic("Is Over Age")
      @documentation("Determines if over a certain age")
      @params(overAge)
      isOverAge (args: OverAge): TernaryEnum {
        console.log('being accessed')
        return TernaryEnum.TRUE;
      }
    }


    const libraryContainer = new LibraryContainer()

    libraryContainer.add(HeartDiseaseLibrary)

    const logicFunc = libraryContainer.getLogic('HeartDisease', 'isOverAge', {patientId: '123'})

    console.log('alekej', logicFunc.execute())

    // const evaluator = new LogicLibrary();

//     DependencyInjection.get(LogicLibrary);

//     console.log('done Instantiations', LogicLibrary)
     
//     console.log(registered)
//     // expect(false).toEqual(evaluator.isOverAge({age: 10}))
// // const line = new Line()
// // line.start = new Point(0, 0)

//     const foundKeys = Reflect.getOwnMetadataKeys(LogicLibrary)
//     console.log("found end:",foundKeys)
//     console.log("thing", LogicLibrary)

//     foundKeys.forEach((key: string) => {
//       if (key.startsWith('statement:')) {
//         console.log('found statement', Reflect.getMetadata(key, LogicLibrary))
//       }
//       // Reflect.getMetadata("design:returntype", target, propertyKey);
//     })

    expect(false).toEqual(true)
    // expect(packagesCqflowEvaluator()).toEqual('packages/cqflow-evaluator');
  });
});
