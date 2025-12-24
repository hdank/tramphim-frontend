import 'es-module-lexer';
import './chunks/astro-designed-error-pages_p36J9fC9.mjs';
import 'piccolore';
import './chunks/astro/server_Boq9MD4A.mjs';
import 'clsx';
import { s as sequence } from './chunks/index_BssoIJSk.mjs';

const onRequest$1 = async (context, next) => {
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
      headers: response.headers
    });
  }
  return response;
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
