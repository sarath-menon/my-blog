
import { MDXRemote } from 'next-mdx-remote/rsc'
import { promises as fs } from "fs";
import * as matter from 'gray-matter';
import { compareDesc } from "date-fns";

export async function generateStaticParams() {
  const fs = require("fs");
  const path = require("path");
  const contentDirectory = path.join(process.cwd(), "app/content");
  const filenames = fs.readdirSync(contentDirectory);

  const posts = filenames
  .map((filename: string) => {
    const filePath = path.join(contentDirectory, filename);
    const { data, content } = matter.read(filePath);
    return { ...data, content, fileName: filename };
  })
  .filter((post: { published: boolean }) => {
    return post.published;
  })
  .sort((a: { date: string }, b: { date: string }) => {
    return compareDesc(new Date(a.date), new Date(b.date));
  });
 
  return posts.map((post) => ({
    slug: post.fileName,
  }))
}

export default async function BlogPage({ params }: { params: { slug: string } }) {

  const filePath = process.cwd() + '/app/content/' + params.slug;
  const mdxSource = matter.read(filePath);

  return (<div className="prose dark:prose-invert">
    <MDXRemote source={mdxSource.content} /></div>)
}

