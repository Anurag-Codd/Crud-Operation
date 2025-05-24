import { Controller, Get, Param } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './schema/post.schema';

@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  async getAllPost(): Promise<{ message: string; posts: Post[] }> {
    return await this.postService.allPost();
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ message: string; post: Post }> {
    return await this.postService.singlePost(id);
  }
}
