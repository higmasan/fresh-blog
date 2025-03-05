export interface Post {
  _id: string;
  title: string;
  content: string;
  snippet: string;
  publishedAt: Date;
  slug: string;
}

export interface CreatePost {
  title: string;
  content: string;
  snippet: string;
  publishedAt: Date;
  slug: string;
}