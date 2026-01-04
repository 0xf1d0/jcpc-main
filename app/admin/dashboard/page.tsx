import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Plus, 
  Users, 
  Mail, 
  Eye, 
  Briefcase,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Hash
} from "lucide-react"
import { PostActions } from "@/components/admin/post-actions"

export const dynamic = "force-dynamic"

const categoryLabels: Record<string, { label: string; color: string }> = {
  ctf: { label: "CTF", color: "bg-cyan-500/20 text-cyan-400" },
  writeup: { label: "Writeup", color: "bg-purple-500/20 text-purple-400" },
  hardening: { label: "Hardening", color: "bg-emerald-500/20 text-emerald-400" },
  tutorial: { label: "Tutoriel", color: "bg-amber-500/20 text-amber-400" },
  event: { label: "Événement", color: "bg-pink-500/20 text-pink-400" },
}

export default async function AdminDashboardPage() {
  // Fetch data with error handling
  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = []
  let contacts: Awaited<ReturnType<typeof prisma.contact.findMany>> = []
  let stats = { totalPosts: 0, publishedPosts: 0, totalContacts: 0, unreadContacts: 0 }
  
  try {
    posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    contacts = await prisma.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    })

    const [totalPosts, publishedPosts, totalContacts, unreadContacts] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.contact.count(),
      prisma.contact.count({ where: { read: false } }),
    ])

    stats = { totalPosts, publishedPosts, totalContacts, unreadContacts }
  } catch (error) {
    console.error("Dashboard data fetch error:", error)
  }

  const statsCards = [
    {
      title: "Articles totaux",
      value: stats.totalPosts,
      icon: FileText,
      color: "from-cyan-500 to-blue-600",
      bgColor: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
    },
    {
      title: "Articles publiés",
      value: stats.publishedPosts,
      icon: Eye,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
    },
    {
      title: "Messages reçus",
      value: stats.totalContacts,
      icon: Mail,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Non lus",
      value: stats.unreadContacts,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500",
    },
  ]

  const quickLinks = [
    { label: "Nouvel article", href: "/admin/dashboard/new", icon: Plus, color: "text-cyan-500" },
    { label: "Services", href: "/admin/dashboard/services", icon: Briefcase, color: "text-purple-500" },
    { label: "Équipe", href: "/admin/dashboard/team", icon: Users, color: "text-emerald-500" },
    { label: "Tags", href: "/admin/dashboard/tags", icon: Hash, color: "text-amber-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-linear-to-br ${stat.color} opacity-5`} />
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1 bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-500" />
                  Articles récents
                </CardTitle>
                <CardDescription>Les derniers articles du journal</CardDescription>
              </div>
              <Link href="/admin/dashboard/new">
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Nouveau
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {posts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun article pour le moment</p>
                  <Link href="/admin/dashboard/new">
                    <Button variant="link">Créer votre premier article</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge className={categoryLabels[post.category]?.color || ""}>
                            {categoryLabels[post.category]?.label || post.category}
                          </Badge>
                          {post.featured && (
                            <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                              Featured
                            </Badge>
                          )}
                          {!post.published && (
                            <Badge variant="outline" className="text-muted-foreground">
                              Brouillon
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                      </div>
                      <PostActions post={post} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Accès rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href}>
                    <Button 
                      variant="outline" 
                      className="w-full justify-between bg-transparent border-border/50 hover:bg-muted/50 group"
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${link.color}`} />
                        {link.label}
                      </span>
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Messages */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-purple-500" />
                Messages récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {contacts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun message
                </p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id} 
                      className="p-3 rounded-xl border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{contact.name}</span>
                        {!contact.read && (
                          <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{contact.subject}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(contact.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
