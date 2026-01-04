import { prisma } from "@/lib/prisma"
import { CTFSectionClient, type BlogPost } from "./ctf-section-client"

export async function CTFSection() {
  let posts: BlogPost[] = []

  try {
    const dbPosts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 12, // Limit to 12 posts for the landing page
    })

    posts = dbPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category as BlogPost["category"],
      tags: post.tags,
      authorName: post.authorName,
      publishedAt: post.publishedAt,
      readingTime: post.readingTime,
      featured: post.featured,
      difficulty: post.difficulty as BlogPost["difficulty"],
      ctfName: post.ctfName,
      ctfDate: post.ctfDate,
      ranking: post.ranking,
      eventDate: post.eventDate,
      eventLocation: post.eventLocation,
      eventUrl: post.eventUrl,
    }))
  } catch (error) {
    console.error("Failed to fetch posts:", error)
  }

  if (posts.length === 0) {
    return null // Don't render section if no posts in database
  }

  return <CTFSectionClient posts={posts} />
}
