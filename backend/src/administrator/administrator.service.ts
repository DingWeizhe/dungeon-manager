import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { Administrator } from './entities/administrator.entity';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
  ) {}

  async create(
    createAdministratorDto: CreateAdministratorDto,
  ): Promise<Administrator> {
    const administrator = this.administratorRepository.create(
      createAdministratorDto,
    );
    return this.administratorRepository.save(administrator);
  }

  async findAll(): Promise<Administrator[]> {
    return this.administratorRepository.find();
  }

  async findOne(id: string): Promise<Administrator> {
    return this.administratorRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updateAdministratorDto: UpdateAdministratorDto,
  ): Promise<Administrator> {
    await this.administratorRepository.update(id, updateAdministratorDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.administratorRepository.delete(id);
  }
}
