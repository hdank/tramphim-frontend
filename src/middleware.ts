import type { MiddlewareHandler } from "astro";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const response = await next();

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    let html = await response.text();

    html = html.replace(
      /<style>astro-island,astro-slot,astro-static-slot\{display:contents\}<\/style>/g,
      ""
    );

    return new Response(html, {
      status: response.status,
      headers: response.headers,
    });
  }

  return response;
};
