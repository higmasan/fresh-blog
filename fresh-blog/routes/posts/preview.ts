import { Handlers } from "$fresh/server.ts"
import { render } from "jsr:@deno/gfm"

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();
    const title = form.get("title")?.toString() || ""
    const content = form.get("content")?.toString() || ""
    const snippet = form.get("snippet")?.toString() || ""
    
    const html = render(content);
    
    return new Response(JSON.stringify({
      title,
      snippet,
      rawContent: content,
      content: html,
      date: new Date().toLocaleDateString("en-us", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }))
  }
}