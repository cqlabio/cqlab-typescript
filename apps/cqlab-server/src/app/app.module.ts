import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowDefinitionEntity } from './models/flow-definition.entity';

import { FlowController } from './routes/flow.controller';
import { FlowService } from './routes/flow.service';

import { FlowImplementationController } from './routes/flow-implementation.controller';
import { FlowImplementationService } from './routes/flow-implementation.service';

import { FlowInstanceController } from './routes/flow-instance.controller';
import { FlowInstanceService } from './routes/flow-instance.service';
import { FlowInstanceEntity } from './models/flow-instance.entity';

import { LibraryController } from './routes/libraries.controller';
import { LibraryService } from './routes/libraries.service';

import { VocabularyController } from './routes/vocabulary.controller';

import { MockDataController } from './routes/mock-data.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'cqlab-db.sqlite',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      // database: 'test',
      entities: [FlowDefinitionEntity, FlowInstanceEntity],
      synchronize: true,
    }),

    TypeOrmModule.forFeature([FlowDefinitionEntity, FlowInstanceEntity]),
  ],
  controllers: [
    FlowController,
    FlowImplementationController,
    FlowInstanceController,
    LibraryController,
    VocabularyController,
    MockDataController,
  ],
  providers: [
    FlowService,
    FlowImplementationService,
    FlowInstanceService,
    LibraryService,
  ],
})
export class AppModule {}
