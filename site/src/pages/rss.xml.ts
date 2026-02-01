import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { REPO_URL, withBase } from "@/config";

export async function GET(context: APIContext) {
  const notebooks = await getCollection("notebooks");
  const siteUrl = context.site!;

  return rss({
    title: "Forgebook",
    description:
      "A notebook-first AI cookbook. Jupyter notebook examples and tutorials.",
    site: siteUrl,
    items: notebooks.map((notebook) => ({
      title: notebook.data.title,
      pubDate: notebook.data.date
        ? new Date(notebook.data.date)
        : new Date(),
      description: notebook.data.description || "",
      // Absolute URL for NLWeb compatibility (used as document identifier)
      link: new URL(withBase(`/notebook/${notebook.data.slug}/`), siteUrl).href,
      categories: notebook.data.tags || [],
      author: notebook.data.authors.map((a) => a.github).join(", "),
    })),
    customData: `<language>en-us</language>
<docs>${REPO_URL}</docs>`,
    stylesheet: withBase("/rss/styles.xsl"),
  });
}
