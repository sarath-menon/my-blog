import { MDXRemote } from "next-mdx-remote/rsc";
import * as matter from "gray-matter";
import { compareDesc } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import { Callout } from "@/components/callout";
import "@/styles/mdx.css";
import { DashboardTableOfContents } from "@/components/toc";
import { getTableOfContents } from "@/lib/toc";
import { ScrollArea } from "@/components/ui/scroll-area";
import Head from "next/head";
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

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
  }));
}

const author = {
  title: "Sarath Suresh",
  avatar:
    "https://pbs.twimg.com/profile_images/1795021923484585984/U0Y9blsk_400x400.jpg",
  twitter: "https://twitter.com/sarath_Men0n",
};

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = process.cwd() + "/app/content/" + params.slug;
  let { data, content } = matter.read(filePath);

  // to wrap latet sections with <Latex> tag
  const regex = /(\$\$(.*?)\$\$|\$(.*?)\$)/gm;
  content = content.replace(regex, (match) => {
  const cleanedMatch = match.replace(/^\$\$?/g, "").replace(/\$\$?$/g, "");
  return `<Latex>$${cleanedMatch}$</Latex>`;
});
  
  const post = { ...data, content };
  const toc = await getTableOfContents(post.content);

  return (
    <>
      <div className="container grid py-6 xl:grid-cols-[1fr_200px] ">
        {/* <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        See all posts
      </Link> */}

        <div className="grid place-content-center space-y-4 ">
          {post.date && (
            <time
              dateTime={post.date}
              className="block text-sm text-muted-foreground"
            >
              Published on {formatDate(post.date)}
            </time>
          )}
          <h1 className="mt-2 inline-block font-semibold text-4xl leading-tight lg:text-5xl">
            {post.title}
          </h1>

          <Link
            key={author._id}
            href={`https://twitter.com/${author.twitter}`}
            className="flex items-center space-x-2 text-sm"
          >
            <Image
              src={author.avatar}
              alt={author.title}
              width={42}
              height={42}
              className="rounded-full bg-white"
            />
            <div className="flex-1 text-left leading-tight">
              <p className="font-medium">{author.title}</p>
              <p className="text-[12px] text-muted-foreground">
                @{author.twitter}
              </p>
            </div>
          </Link>

          <article className="prose dark:prose-invert mt-8 leading-7 max-w-2xl prose-pre:border prose-pre:bg-neutral-900">
            
            <MDXRemote source={post.content} components={{ Image, Latex }} />
          </article>

          <hr className="mt-12" />
          <div className="flex justify-center py-6 lg:py-10">
            <Link
              href="/blog"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              See all posts
            </Link>
          </div>
        </div>
        

        <div className="hidden text-sm xl:block ">
          <div className="sticky top-16  pt-4">
            <ScrollArea className="pb-10">
              <div className="sticky top-16 h-[calc(100vh-3.5rem)] py-12">
                <DashboardTableOfContents toc={toc} />
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
