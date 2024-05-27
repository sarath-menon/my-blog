import { MDXRemote } from 'next-mdx-remote/rsc'
import { promises as fs } from "fs";
import * as matter from 'gray-matter';
 
export default async function RemoteMdxPage() {
  // const source = await fs.readFile(
  //   process.cwd() + "/app/content/test.mdx",
  //   "utf8"
  // );

  const mdxSource = matter.read(process.cwd() +'/app/content/test.mdx');

  console.log("selv mdxSource.excerpt", mdxSource.data);

  return <div className="prose dark:prose-invert"><MDXRemote source={mdxSource.content} /></div>
}

