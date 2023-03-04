import { Module } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { QuoteController } from './quote.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { quote } from 'models';

@Module({
  imports: [SequelizeModule.forFeature([quote])],
  controllers: [QuoteController],
  providers: [QuoteService],
})
export class QuoteModule {}
