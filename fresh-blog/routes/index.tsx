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
        <h1 className="text-5xl font-bold">Blog</h1>
        <div className="mt-8">
          {posts.map((post) => <h2>{post.title}</h2>)}
        </div>
      </main>
    </>
  );
}
