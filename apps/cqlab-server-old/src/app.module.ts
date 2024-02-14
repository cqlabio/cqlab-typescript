import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlowDefinitionEntity } from './models/flow-definition.entity';

@Module({
  imports: [

    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: "cqlab-db.sqlite",
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      // database: 'test',
      entities: [
        FlowDefinitionEntity
      ],
      synchronize: true,
    }),

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
