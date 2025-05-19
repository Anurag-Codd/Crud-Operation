import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async allPost(): Promise<{ message: string; posts: unknown[] }> {
    const allPosts = await this.postModel.find({}).lean();

    if (allPosts.length <= 0) {
      throw new NotFoundException('No Posts are found');
    }

    return {
      message: 'Post fetched Successfully',
      posts: allPosts,
    };
  }
}
