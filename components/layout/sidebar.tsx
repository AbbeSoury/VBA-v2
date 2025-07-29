"use client"

import { BookOpen, Code, FileText, Home, Trophy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const courses = [
  { id: 1, title: "Introduction à VBA", progress: 85, color: "bg-blue-500" },
  { id: 2, title: "Variables et Types", progress: 60, color: "bg-green-500" },
  { id: 3, title: "Boucles et Conditions", progress: 30, color: "bg-purple-500" },
  { id: 4, title: "Fonctions Avancées", progress: 0, color: "bg-orange-500" },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border z-40 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 px-4 py-2">
            <div className="space-y-2">
              <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors">
                <Home className="h-4 w-4" />
                <span>Tableau de bord</span>
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                <span>Cours</span>
              </Link>
              <Link
                href="/exercises"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Code className="h-4 w-4" />
                <span>Exercices</span>
              </Link>
              <Link
                href="/projects"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>Projets</span>
              </Link>
              <Link
                href="/tests"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
              >
                <Trophy className="h-4 w-4" />
                <span>Tests</span>
              </Link>
            </div>
          </nav>

          <div className="p-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Progression des cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate">{course.title}</span>
                      <span className="text-muted-foreground">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-1" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </aside>
    </>
  )
}
