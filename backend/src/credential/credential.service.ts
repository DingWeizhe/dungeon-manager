import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { Credential } from './entities/credential.entity';

@Injectable()
export class CredentialService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepository: Repository<Credential>,
  ) {}

  async create(createCredentialDto: CreateCredentialDto): Promise<Credential> {
    const credential = this.credentialRepository.create(createCredentialDto);
    return this.credentialRepository.save(credential);
  }

  async findAll(): Promise<Credential[]> {
    return this.credentialRepository.find();
  }

  async findOne(id: string): Promise<Credential> {
    return this.credentialRepository.findOneOrFail({ where: { id } });
  }

  async update(
    id: string,
    updateCredentialDto: UpdateCredentialDto,
  ): Promise<Credential> {
    await this.credentialRepository.update(id, updateCredentialDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.credentialRepository.delete(id);
  }
}
