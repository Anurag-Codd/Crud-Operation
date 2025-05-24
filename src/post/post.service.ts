import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async allPost(): Promise<{ message: string; posts: Post[] }> {
    const allPosts = await this.postModel.find({}).lean();

    if (allPosts.length <= 0) {
      throw new NotFoundException('No Posts are found');
    }

    return {
      message: 'Posts fetched Successfully',
      posts: allPosts,
    };
  }

  async singlePost(id: string): Promise<{ message: string; post: Post }> {
    const Post = await this.postModel.findById(id);

    if (!Post) {
      throw new NotFoundException('Post not Found');
    }

    return {
      message: 'A Post is Fetched',
      post: Post,
    };
  }
}
