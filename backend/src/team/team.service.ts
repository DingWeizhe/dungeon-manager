import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    const team = this.teamRepository.create(createTeamDto);
    return this.teamRepository.save(team);
  }

  async findAll(): Promise<Team[]> {
    return this.teamRepository.find();
  }

  async findOne(id: string): Promise<Team> {
    return this.teamRepository.findOneOrFail({ where: { id } });
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    await this.teamRepository.update(id, updateTeamDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.teamRepository.delete(id);
  }
}
