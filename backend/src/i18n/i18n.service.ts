import { Injectable } from '@nestjs/common';
import { CreateI18nDto } from './dto/create-i18n.dto';
import { UpdateI18nDto } from './dto/update-i18n.dto';

@Injectable()
export class I18nService {
  create(createI18nDto: CreateI18nDto) {
    return 'This action adds a new i18n';
  }

  findAll() {
    return `This action returns all i18n`;
  }

  findOne(id: number) {
    return `This action returns a #${id} i18n`;
  }

  update(id: number, updateI18nDto: UpdateI18nDto) {
    return `This action updates a #${id} i18n`;
  }

  remove(id: number) {
    return `This action removes a #${id} i18n`;
  }
}
