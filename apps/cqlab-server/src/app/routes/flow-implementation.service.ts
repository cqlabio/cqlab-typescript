import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { flowRepository } from '@cqlab/cqexamples';

@Injectable()
export class FlowImplementationService {
  async getFlowImplementationByBindId(bindId: string) {
    const module = flowRepository.getInteractiveModule(bindId);

    if (!module) {
      throw new HttpException(
        `Unable to find flow implementation with bindId: ${bindId}`,
        HttpStatus.NOT_FOUND
      );
    }

    // This needs to updated with next release
    return module.getFlowImplementation().getImplementation();
  }

  async getFlowImplementationExampleData(bindId: string) {
    const module = flowRepository.getInteractiveModule(bindId);

    if (!module) {
      throw new HttpException(
        `Unable to find flow implementation with bindId: ${bindId}`,
        HttpStatus.NOT_FOUND
      );
    }

    // This needs to updated with next release
    return module.getTestData();
  }
}
