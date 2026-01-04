"use server"

import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

/**
 * Get all active services ordered by order field
 */
export const getServices = unstable_cache(
  async () => {
    try {
      const services = await prisma.service.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      })
      return services
    } catch (error) {
      console.error("Failed to fetch services:", error)
      return []
    }
  },
  ["services"],
  { revalidate: 60, tags: ["services"] }
)

/**
 * Get all active team members ordered by order field
 */
export const getTeamMembers = unstable_cache(
  async () => {
    try {
      const members = await prisma.teamMember.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      })
      return members
    } catch (error) {
      console.error("Failed to fetch team members:", error)
      return []
    }
  },
  ["team-members"],
  { revalidate: 60, tags: ["team"] }
)

/**
 * Get all site stats ordered by order field
 */
export const getStats = unstable_cache(
  async () => {
    try {
      const stats = await prisma.siteStat.findMany({
        orderBy: { order: "asc" },
      })
      return stats
    } catch (error) {
      console.error("Failed to fetch stats:", error)
      return []
    }
  },
  ["site-stats"],
  { revalidate: 60, tags: ["stats"] }
)

/**
 * Get all active method steps ordered by order field
 */
export const getMethodSteps = unstable_cache(
  async () => {
    try {
      const steps = await prisma.methodStep.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      })
      return steps
    } catch (error) {
      console.error("Failed to fetch method steps:", error)
      return []
    }
  },
  ["method-steps"],
  { revalidate: 60, tags: ["method"] }
)

/**
 * Get all article categories
 */
export const getArticleCategories = unstable_cache(
  async () => {
    try {
      const categories = await prisma.articleCategory.findMany({
        orderBy: { order: "asc" },
      })
      return categories
    } catch (error) {
      console.error("Failed to fetch categories:", error)
      return []
    }
  },
  ["article-categories"],
  { revalidate: 60, tags: ["categories"] }
)

/**
 * Get all tags
 */
export const getTags = unstable_cache(
  async () => {
    try {
      const tags = await prisma.tag.findMany({
        orderBy: { name: "asc" },
      })
      return tags
    } catch (error) {
      console.error("Failed to fetch tags:", error)
      return []
    }
  },
  ["tags"],
  { revalidate: 60, tags: ["tags"] }
)

/**
 * Get all CTF participations
 */
export const getCTFParticipations = unstable_cache(
  async () => {
    try {
      const participations = await prisma.cTFParticipation.findMany({
        orderBy: { date: "desc" },
      })
      return participations
    } catch (error) {
      console.error("Failed to fetch CTF participations:", error)
      return []
    }
  },
  ["ctf-participations"],
  { revalidate: 60, tags: ["ctf"] }
)
