import { connectDB } from "../connection.ts";
import { Post, CreatePost } from "../models/post.ts";

export class PostRepository {
  private static async getCollection() {
    const db = await connectDB();
    return db.collection<Post>("posts");
  }

  static async create(post: CreatePost): Promise<void> {
    const posts = await this.getCollection();
    await posts.insertOne({
      ...post,
      _id: crypto.randomUUID(),
    });
  }

  static async findAll(): Promise<Post[]> {
    const posts = await this.getCollection();
    return await posts.find()
      .sort({ publishedAt: -1 })
      .toArray();
  }

  static async findBySlug(slug: string): Promise<Post | null> {
    const posts = await this.getCollection();
    return await posts.findOne({ slug }) || null;
  }

  static async update(slug: string, post: Partial<CreatePost>): Promise<void> {
    const posts = await this.getCollection();
    await posts.updateOne(
      { slug },
      { $set: post }
    );
  }

  static async delete(slug: string): Promise<void> {
    const posts = await this.getCollection();
    await posts.deleteOne({ slug });
  }
}