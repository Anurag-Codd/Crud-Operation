import { IsNotEmpty, IsOptional } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  userId: string;
}

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsNotEmpty()
  userId: string;
}
