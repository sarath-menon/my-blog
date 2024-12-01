import { MDXRemote } from "next-mdx-remote/rsc";
import * as matter from "gray-matter";
import { compareDesc } from "date-fns";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import Image from "next/image";
import "@/styles/mdx.css";
import { DashboardTableOfContents } from "@/components/toc";
import { Items, getTableOfContents } from "@/lib/toc";
import { ScrollArea } from "@/components/ui/scroll-area";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { slug as slugify } from "github-slugger";
import { contentHeading } from "@/components/content-heading";
import { Post, Author } from "@/types/blog-post";

export async function generateStaticParams() {
  const fs = require("fs");
  const path = require("path");
  const contentDirectory = path.join(process.cwd(), "/content/blog/");
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

  return posts.map((post: Post) => ({
    slug: post.fileName,
  }));
}

const author: Author = {
  title: "Sarath Suresh",
  avatar:
    "https://pbs.twimg.com/profile_images/1795021923484585984/U0Y9blsk_400x400.jpg",
  twitter: "https://twitter.com/sarath_Men0n",
};

const components = {
  h1: contentHeading(1),
  h2: contentHeading(2),
  h3: contentHeading(3),
  h4: contentHeading(4),
  h5: contentHeading(5),
  h6: contentHeading(6),
  Image,
  Latex,
};

export default async function BlogPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const filePath = process.cwd() + "/content/blog/" + params.slug;
  let { data, content } = matter.read(filePath);

  // to wrap latet sections with <Latex> tag
  const regex = /(\$\$(.*?)\$\$|\$(.*?)\$)/gm;
  content = content.replace(regex, (match) => {
    const cleanedMatch = match.replace(/^\$\$?/g, "").replace(/\$\$?$/g, "");
    return `<Latex>$${cleanedMatch}$</Latex>`;
  });

  const post = { ...data, content } as Post;
  const toc = await getTableOfContents(post.content);

  return (
    <>
      <div className="container grid py-6 xl:grid-cols-[1fr_200px] ">
        <div className="grid place-content-center space-y-4 ">
          {post.date && <PostDate date={post.date} />}

          {post.title && <PostTitle title={post.title} />}

          <AuthorLink author={author} />

          <article className="prose dark:prose-invert pt-8 leading-7  max-w-4xl prose-pre:border prose-pre:bg-neutral-900 text-pretty">
            <MDXRemote source={post.content} components={components} />
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

        <TableOfContents toc={toc} />
      </div>
    </>
  );
}

function TableOfContents({ toc }: { toc: Items }) {
  return (
    <div className="hidden text-sm xl:block ">
      <div className="sticky top-16  pt-4">
        <ScrollArea className="pb-10">
          <div className="sticky top-16 h-[calc(100vh-3.5rem)] py-12">
            <div className="no-scrollbar h-full overflow-auto pb-10">
              <DashboardTableOfContents toc={toc} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function AuthorLink({ author }: { author: Author }) {
  return (
    <Link
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
        <p className="text-[12px] text-muted-foreground">@{author.twitter}</p>
      </div>
    </Link>
  );
}

function PostDate({ date }: { date: string }) {
  return (
    <time dateTime={date} className="block text-sm text-muted-foreground">
      Published on {formatDate(date)}
    </time>
  );
}

function PostTitle({ title }: { title: string }) {
  return (
    <h1 className="mt-2 inline-block font-semibold text-4xl leading-tight lg:text-5xl">
      {title}
    </h1>
  );
}
