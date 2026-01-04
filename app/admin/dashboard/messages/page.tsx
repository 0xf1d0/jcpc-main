import { prisma } from "@/lib/prisma"
import { MessagesClient } from "./messages-client"

export default async function MessagesPage() {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  })

  return <MessagesClient contacts={contacts} />
}
