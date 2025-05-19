import { IsNotEmpty } from 'class-validator';

export class PostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class UpdatePostDto {
  @IsNotEmpty()
  title?: string;

  @IsNotEmpty()
  description?: string;
}
