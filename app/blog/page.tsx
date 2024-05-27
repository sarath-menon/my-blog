import Image from "next/image"
import Link from "next/link"
import * as matter from 'gray-matter';
import { formatDate } from "@/lib/utils"
import { compareDesc } from "date-fns"

export const metadata = {
  title: "Blog",
}

export default async function BlogPage() {

  const fs = require('fs');
  const path = require('path');
  const contentDirectory = path.join(process.cwd(), 'app/content');
  const filenames = fs.readdirSync(contentDirectory);

  const posts = filenames.map((filename: string) => {
    const filePath = path.join(contentDirectory, filename);
    const { data, content } = matter.read(filePath);
    return { ...data, content, fileName: filename };
  }).filter((post: { published: boolean }) => {
    return post.published;
  })
  .sort((a: { date: string }, b: { date: string }) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })


  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            A blog built using Contentlayer. Posts are written in MDX.
          </p>
        </div>
      </div>
      <hr className="my-8" />

      {posts?.length ? (
        <div className="grid gap-10 sm:grid-cols-2">
          {posts.map((post: any, index: any) => (
            <article
              key={post.title}
              className="group relative flex flex-col space-y-2"
            >
        
              <Link href={"/blog/" + post.fileName}>
                <span className="text-2xl font-extrabold">{post.title}</span>
              </Link>
              
              {post.description && (
                <p className="text-muted-foreground">{post.description}</p>
              )}
              {post.date && (
                <p className="text-sm text-muted-foreground">
                  {formatDate(post.date)}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p>No posts published.</p>
      )}
    </div>
  )
}