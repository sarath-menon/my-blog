import { MDXRemote } from 'next-mdx-remote/rsc'
import { promises as fs } from "fs";
import * as matter from 'gray-matter';


export default async function BlogPage() {

  const mdxSource = matter.read(process.cwd() +'/app/content/test.mdx');

  return <div className="prose dark:prose-invert"><MDXRemote source={mdxSource.content} /></div>
}

