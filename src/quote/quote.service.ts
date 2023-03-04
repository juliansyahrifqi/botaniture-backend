import { Injectable } from '@nestjs/common';
import { CreateOrUpdateQuoteDto } from './dto/create-update-quote.dto';
import { quote } from 'models';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class QuoteService {
  constructor(@InjectModel(quote) private quoteModel: typeof quote) {}
  async getQuote(): Promise<quote> {
    return await this.quoteModel.findOne({ where: { id: 1 } });
  }

  async update(id = 1, createOrUpdateQuoteDto: CreateOrUpdateQuoteDto) {
    try {
      const quote = await this.quoteModel.findOne({ where: { id: 1 } });

      if (quote === null) {
        return await this.quoteModel.create({
          id,
          ...createOrUpdateQuoteDto,
        });
      }

      await this.quoteModel.update(createOrUpdateQuoteDto, {
        where: { id },
      });
    } catch (e) {
      return e;
    }
  }
}
