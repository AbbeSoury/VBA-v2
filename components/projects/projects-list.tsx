"use client"

import { useState } from "react"
import { Search, Filter, Clock, Calendar, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const projects = [
  {
    id: 1,
    title: "Gestionnaire de Stock Excel",
    description: "Créez un système complet de gestion des stocks avec interface utilisateur intuitive",
    difficulty: "Débutant",
    estimatedTime: "2-3 semaines",
    prerequisites: ["Introduction à VBA", "Variables et Types"],
    dueDate: "2024-02-15",
    progress: 0,
    status: "not_started",
    category: "Gestion",
    skills: ["Formulaires", "Bases de données", "Interface utilisateur"],
  },
  {
    id: 2,
    title: "Système de Facturation Automatisé",
    description: "Développez un système automatisé de génération et gestion de factures",
    difficulty: "Intermédiaire",
    estimatedTime: "3-4 semaines",
    prerequisites: ["Boucles et Conditions", "Fonctions Avancées"],
    dueDate: "2024-03-01",
    progress: 35,
    status: "in_progress",
    category: "Automatisation",
    skills: ["Automatisation", "PDF", "Email", "Calculs"],
  },
  {
    id: 3,
    title: "Dashboard Analytique Avancé",
    description: "Construisez un tableau de bord interactif avec graphiques et analyses en temps réel",
    difficulty: "Avancé",
    estimatedTime: "4-6 semaines",
    prerequisites: ["Toutes les bases VBA", "Manipulation de données"],
    dueDate: "2024-03-20",
    progress: 0,
    status: "locked",
    category: "Analyse",
    skills: ["Graphiques", "API", "Temps réel", "Visualisation"],
  },
  {
    id: 4,
    title: "Générateur de Rapports Automatique",
    description: "Automatisez la création de rapports périodiques avec mise en forme avancée",
    difficulty: "Intermédiaire",
    estimatedTime: "2-3 semaines",
    prerequisites: ["Fonctions Avancées", "Manipulation de fichiers"],
    dueDate: "2024-02-28",
    progress: 0,
    status: "not_started",
    category: "Automatisation",
    skills: ["Rapports", "Mise en forme", "Planification"],
  },
  {
    id: 5,
    title: "Système de Gestion des Employés",
    description: "Développez une application complète de gestion RH avec base de données",
    difficulty: "Avancé",
    estimatedTime: "5-7 semaines",
    prerequisites: ["Bases de données", "Interface avancée"],
    dueDate: "2024-04-10",
    progress: 0,
    status: "not_started",
    category: "Gestion",
    skills: ["Base de données", "Sécurité", "Interface complexe"],
  },
  {
    id: 6,
    title: "Calculatrice Financière Avancée",
    description: "Créez une calculatrice pour analyses financières et investissements",
    difficulty: "Débutant",
    estimatedTime: "1-2 semaines",
    prerequisites: ["Variables et Types", "Fonctions de base"],
    dueDate: "2024-02-10",
    progress: 100,
    status: "completed",
    category: "Finance",
    skills: ["Calculs financiers", "Interface simple", "Validation"],
  },
]

const difficultyColors = {
  Débutant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Intermédiaire: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Avancé: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const statusLabels = {
  not_started: "Commencer",
  in_progress: "Continuer",
  completed: "Terminé",
  locked: "Verrouillé",
}

function getDaysUntilDue(dueDate: string) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function ProjectsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || project.difficulty === difficultyFilter
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter

    return matchesSearch && matchesDifficulty && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Projets VBA</h1>
        <p className="text-purple-100">Mettez en pratique vos compétences avec des projets concrets et progressifs</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les difficultés</SelectItem>
                <SelectItem value="Débutant">Débutant</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="Avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Gestion">Gestion</SelectItem>
                <SelectItem value="Automatisation">Automatisation</SelectItem>
                <SelectItem value="Analyse">Analyse</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>{filteredProjects.length} projet(s) trouvé(s)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const daysUntilDue = getDaysUntilDue(project.dueDate)

          return (
            <Card key={project.id} className="flex flex-col h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                    <CardDescription className="text-sm">{project.description}</CardDescription>
                  </div>
                  <Badge className={difficultyColors[project.difficulty as keyof typeof difficultyColors]}>
                    {project.difficulty}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 flex-1">
                  {/* Time and Prerequisites */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Durée estimée: {project.estimatedTime}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className={daysUntilDue < 7 ? "text-red-600" : ""}>
                        {daysUntilDue > 0 ? `Dans ${daysUntilDue} jour(s)` : "Échéance dépassée"}
                      </span>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <BookOpen className="h-4 w-4" />
                      <span>Prérequis:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {project.prerequisites.map((prereq, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {prereq}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <div className="text-sm font-medium mb-2">Compétences développées:</div>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Progress */}
                  {project.status === "in_progress" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progression</span>
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                  )}

                  {project.status === "completed" && (
                    <div className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm font-medium">Projet terminé</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-4">
                  {project.status === "locked" ? (
                    <Button disabled className="w-full">
                      {statusLabels[project.status]}
                    </Button>
                  ) : (
                    <Link href={`/projects/${project.id}`} className="w-full">
                      <Button className="w-full" variant={project.status === "completed" ? "outline" : "default"}>
                        {statusLabels[project.status]}
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Aucun projet trouvé</p>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
