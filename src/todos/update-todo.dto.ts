import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateTodoDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Title should not be empty if provided' })
  title?: string;
}
