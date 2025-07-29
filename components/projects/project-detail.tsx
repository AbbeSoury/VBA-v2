"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, BookOpen, Target, FileText, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ProjectSteps } from "./project-steps"
import { ProjectSubmission } from "./project-submission"

interface ProjectDetailProps {
  projectId: string
}

// Mock data - in real app, this would come from API
const projectData = {
  1: {
    id: 1,
    title: "Gestionnaire de Stock Excel",
    description:
      "Créez un système complet de gestion des stocks avec interface utilisateur intuitive et fonctionnalités avancées de suivi des inventaires.",
    difficulty: "Débutant",
    estimatedTime: "2-3 semaines",
    prerequisites: ["Introduction à VBA", "Variables et Types"],
    dueDate: "2024-02-15",
    progress: 0,
    status: "not_started",
    category: "Gestion",
    skills: ["Formulaires", "Bases de données", "Interface utilisateur"],
    objectives: [
      "Créer une interface utilisateur intuitive pour la gestion des stocks",
      "Implémenter un système de suivi des entrées et sorties",
      "Développer des alertes automatiques pour les stocks faibles",
      "Générer des rapports de stock automatisés",
      "Créer un système de sauvegarde et de restauration des données",
    ],
    deliverables: [
      "Fichier Excel (.xlsm) avec le système complet",
      "Documentation utilisateur (PDF)",
      "Guide d'installation et de configuration",
      "Exemples de données de test",
    ],
    resources: [
      { id: 1, title: "Template de base Excel", type: "XLSM", size: "245 KB", url: "#" },
      { id: 2, title: "Guide des bonnes pratiques", type: "PDF", size: "1.2 MB", url: "#" },
      { id: 3, title: "Exemples de données", type: "CSV", size: "15 KB", url: "#" },
      { id: 4, title: "Icônes pour l'interface", type: "ZIP", size: "890 KB", url: "#" },
    ],
    gradingCriteria: [
      {
        criterion: "Fonctionnalité de base",
        weight: 30,
        description: "Le système permet d'ajouter, modifier et supprimer des articles",
      },
      { criterion: "Interface utilisateur", weight: 25, description: "Interface claire, intuitive et professionnelle" },
      {
        criterion: "Gestion des alertes",
        weight: 20,
        description: "Système d'alertes pour les stocks faibles fonctionnel",
      },
      { criterion: "Rapports", weight: 15, description: "Génération de rapports précis et bien formatés" },
      {
        criterion: "Code et documentation",
        weight: 10,
        description: "Code propre, commenté et documentation complète",
      },
    ],
  },
}

const difficultyColors = {
  Débutant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Intermédiaire: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Avancé: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

function getDaysUntilDue(dueDate: string) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

export function ProjectDetail({ projectId }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const project = projectData[projectId as keyof typeof projectData]

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Projet non trouvé</p>
        <Link href="/projects">
          <Button className="mt-4">Retour aux projets</Button>
        </Link>
      </div>
    )
  }

  const daysUntilDue = getDaysUntilDue(project.dueDate)

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/projects">
        <Button variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <Badge className={`${difficultyColors[project.difficulty as keyof typeof difficultyColors]} text-sm`}>
                {project.difficulty}
              </Badge>
            </div>
            <p className="text-purple-100 text-lg mb-4">{project.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <div>
                  <div className="text-sm text-purple-200">Durée estimée</div>
                  <div className="font-medium">{project.estimatedTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <div>
                  <div className="text-sm text-purple-200">Échéance</div>
                  <div className={`font-medium ${daysUntilDue < 7 ? "text-red-200" : ""}`}>
                    {daysUntilDue > 0 ? `Dans ${daysUntilDue} jour(s)` : "Échéance dépassée"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <div>
                  <div className="text-sm text-purple-200">Progression</div>
                  <div className="font-medium">{project.progress}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-64">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-purple-200 mb-2">Progression du projet</div>
                <Progress value={project.progress} className="bg-purple-400" />
              </div>
              <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-purple-50">
                {project.progress === 0 ? "Commencer le projet" : "Continuer"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Prérequis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.prerequisites.map((prereq, index) => (
              <Badge key={index} variant="outline">
                {prereq}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="steps">Étapes</TabsTrigger>
          <TabsTrigger value="resources">Ressources</TabsTrigger>
          <TabsTrigger value="submission">Soumission</TabsTrigger>
          <TabsTrigger value="criteria">Critères</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectifs du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Livrables attendus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {project.deliverables.map((deliverable, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                      <span className="text-sm">{deliverable}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compétences développées</CardTitle>
              <CardDescription>Ce projet vous permettra de développer les compétences suivantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps">
          <ProjectSteps projectId={projectId} />
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ressources du projet</CardTitle>
              <CardDescription>
                Téléchargez les fichiers et ressources nécessaires pour réaliser ce projet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{resource.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {resource.type} • {resource.size}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Télécharger
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission">
          <ProjectSubmission projectId={projectId} />
        </TabsContent>

        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Critères d'évaluation
              </CardTitle>
              <CardDescription>Votre projet sera évalué selon les critères suivants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.gradingCriteria.map((criteria, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{criteria.criterion}</h4>
                      <Badge variant="outline">{criteria.weight}%</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{criteria.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Barème de notation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600 mb-1">0-59%</div>
                  <div className="text-sm font-medium">Insuffisant</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600 mb-1">60-69%</div>
                  <div className="text-sm font-medium">Passable</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">70-84%</div>
                  <div className="text-sm font-medium">Bien</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">85-100%</div>
                  <div className="text-sm font-medium">Excellent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
