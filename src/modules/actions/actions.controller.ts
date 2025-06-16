import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { UUIDValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Post()
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionsService.create(createActionDto);
  }

  @Get()
  findAll() {
    return this.actionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', UUIDValidationPipe) id: string) {
    return this.actionsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', UUIDValidationPipe) id: string, @Body() updateActionDto: UpdateActionDto) {
    return this.actionsService.update(id, updateActionDto);
  }

  @Delete(':id')
  remove(@Param('id', UUIDValidationPipe) id: string) {
    return this.actionsService.remove(id);
  }
}
