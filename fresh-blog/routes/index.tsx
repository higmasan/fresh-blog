import { Handlers, PageProps } from "$fresh/server.ts"
import { getPosts, Post } from "../utils/posts.ts"

export const handler: Handlers<Post[]> = {
  async GET(_req, ctx) {
    const posts = await getPosts();
    return ctx.render(posts);
  },
}

export default function Home(props: PageProps<Post[]>) {
  const posts = props.data
  return (
    <>
      <main className="max-w-screen-md px-4 pt-16 mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-5xl font-bold">Blog</h1>
          <a
            href="/posts/new"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            投稿する
          </a>
        </div>
        <div className="mt-8">
          {posts.map((post) => <PostCard post={post} />)}
        </div>
      </main>
    </>
  );
}

function PostCard(props: { post: Post }) {
  const { post } = props;
  return (
    <div className="py-8 border-t border-gray-200)">
      <a className="sm:col-span-2" href={`/${post.slug}`}>
        <h3 className="text-3xl text-gray-900 font-bold">
          {post.title}
        </h3>
        <time className="text-gray-500">
          {new Date(post.publishedAt).toLocaleDateString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        <div className="mt-4 text-gray-900">
          {post.snippet}
        </div>
      </a>
    </div>
  );
}