
import { MDXRemote } from 'next-mdx-remote/rsc'
import { promises as fs } from "fs";
import * as matter from 'gray-matter';
import { compareDesc } from "date-fns";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { buttonVariants } from "@/components/ui/button"
import { cn, formatDate } from '@/lib/utils';
import Image from 'next/image';

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
  const { data, content }  = matter.read(filePath);
  const post = { ...data, content };

  return (

<div className="container relative max-w-3xl py-6 lg:py-10">
      <Link
        href="/blog"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-14 hidden xl:inline-flex"
        )}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        See all posts
      </Link>
      <div></div>
  

    {/* <div className="prose dark:prose-invert">
    <MDXRemote source={mdxSource.content} />
    </div> */}

    <div>
        {post.date && (
          <time
            dateTime={post.date}
            className="block text-sm text-muted-foreground"
          >
            Published on {formatDate(post.date)}
          </time>
        )}
        <h1 className="mt-2 inline-block font-heading text-4xl leading-tight lg:text-5xl">
          {post.title}
        </h1>

        {post.authors?.length ? (
          <div className="mt-4 flex space-x-4">
            {post.authors.map((author) =>
              author ? (
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
              ) : null
            )}
          </div>
        ) : null}

      </div>
      {/* {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="my-8 rounded-md border bg-muted transition-colors"
          priority
        />
      )}
       */}
      <div className="prose dark:prose-invert">
    <MDXRemote source={post.content} />
    </div>

      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={cn(buttonVariants({ variant: "ghost" }))}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
</div>
    
    )
}

