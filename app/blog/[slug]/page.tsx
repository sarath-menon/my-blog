
import { MDXRemote } from 'next-mdx-remote/rsc'
import { promises as fs } from "fs";
import * as matter from 'gray-matter';


export default async function BlogPage({ params }: { params: { slug: string } }) {

  const filePath = process.cwd() + '/app/content/' + params.slug;
  const mdxSource = matter.read(filePath);
  

  return (<div className="prose dark:prose-invert">
    <MDXRemote source={mdxSource.content} /></div>)
}

