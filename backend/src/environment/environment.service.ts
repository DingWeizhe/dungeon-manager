import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEnvironmentDto } from './dto/create-environment.dto';
import { UpdateEnvironmentDto } from './dto/update-environment.dto';
import { Environment } from './entities/environment.entity';

@Injectable()
export class EnvironmentService {
  constructor(
    @InjectRepository(Environment)
    private readonly environmentRepository: Repository<Environment>,
  ) {}

  async create(
    createEnvironmentDto: CreateEnvironmentDto,
  ): Promise<Environment> {
    const environment = this.environmentRepository.create(createEnvironmentDto);
    return this.environmentRepository.save(environment);
  }

  async findAll(): Promise<Environment[]> {
    return this.environmentRepository.find();
  }

  async findOne(id: string): Promise<Environment> {
    return this.environmentRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updateEnvironmentDto: UpdateEnvironmentDto,
  ): Promise<Environment> {
    await this.environmentRepository.update(id, updateEnvironmentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.environmentRepository.delete(id);
  }
}
