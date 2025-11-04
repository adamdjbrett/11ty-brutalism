import { IdAttributePlugin, InputPathToUrlTransformPlugin, HtmlBasePlugin } from "@11ty/eleventy";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import pluginNavigation from "@11ty/eleventy-navigation";
import yaml from "js-yaml";
import fs from "node:fs";
import pluginFilters from "./_config/filters.js";
import htmlmin from "html-minifier-terser";

export default async function(eleventyConfig) {
  // Load site metadata from _data/metadata.yaml
  const siteMeta = yaml.load(fs.readFileSync("./_data/metadata.yaml", "utf8"));

  // Drafts skip
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if(data.draft && process.env.ELEVENTY_RUN_MODE === "build") {
      return false;
    }
  });

  // Passthrough copy
  eleventyConfig
    .addPassthroughCopy({"./public/": "/"})
    .addPassthroughCopy("./content/feed/pretty-atom-feed.xsl");

  eleventyConfig.addWatchTarget("content/**/*.{svg,webp,png,jpeg}");

  // Bundles
  eleventyConfig.addBundle("css", { toFileDirectory: "dist" });
  eleventyConfig.addBundle("js", { toFileDirectory: "dist" });

  // YAML support
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Plugins
  eleventyConfig.addPlugin(pluginSyntaxHighlight, { preAttributes: { tabindex: 0 } });
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(HtmlBasePlugin, { baseHref: "/" }); // <-- important for correct paths
  eleventyConfig.addPlugin(InputPathToUrlTransformPlugin);

  // HTML minify
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true
      });
    }
    return content;
  });

  // RSS Feed plugin
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom", // or "rss", "json"
    outputPath: "/feed/feed.xml",
    stylesheet: "pretty-atom-feed.xsl",
    collection: {
      name: "posts",
      limit: 10,
    },
    metadata: {
      language: siteMeta?.language,
      title: siteMeta?.title,
      subtitle: siteMeta?.description,
      base: siteMeta?.url,
      author: {
        name: siteMeta?.author?.name,
        email: siteMeta?.author?.email,
        url: siteMeta?.author?.url
      }
    },
    templateData: {
      eleventyNavigation: {
        key: "Feed",
        order: 4
      }
    }
  });

  eleventyConfig.addPlugin(pluginFilters);
  eleventyConfig.addPlugin(IdAttributePlugin);

  // Shortcodes
  eleventyConfig.addShortcode("currentBuildDate", () => (new Date()).toISOString());
};

export const config = {
  templateFormats: ["md", "njk", "html", "liquid", "11ty.js"],
  markdownTemplateEngine: "njk",
  htmlTemplateEngine: "njk",
  dir: {
    input: "content",
    includes: "../_includes",
    data: "../_data",
    output: "_site" // build folder
  }
};
