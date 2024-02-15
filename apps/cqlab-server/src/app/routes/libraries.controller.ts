import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import flatten from 'lodash/flatten';
// import { FlowInstanceService } from './flow-instance.service';
// import { InitialData, MockDbService } from './mock-db.service';
import { LibraryService } from './libraries.service';

@Controller('libraries')
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Get('registry')
  getLogicLibraryRegistry() {
    return this.libraryService.getLogicLibraryRegistry();
  }

  // @Get('patients/all')
  // getAllPatients() {
  //   return flatten(Object.values(ALL_PATIENTS));
  // }

  @Post('execute')
  executeLogic(
    @Body()
    body: {
      className: string;
      classFunctionName: string;
      mockDataId: string;
      parameters: any;
    }
  ) {
    return this.libraryService.executeLogic(body);
  }
}
