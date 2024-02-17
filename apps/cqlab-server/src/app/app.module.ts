import { join } from 'path';
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
import { ServeStaticModule } from '@nestjs/serve-static';

import { SeedDBController } from './routes/seed-db.controller';
import { SeedDBService  } from './routes/seed-db.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'cqlab-ui'),
    }),
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
    SeedDBController
  ],
  providers: [
    FlowService,
    FlowImplementationService,
    FlowInstanceService,
    LibraryService,
    SeedDBService
  ],
})
export class AppModule {}
