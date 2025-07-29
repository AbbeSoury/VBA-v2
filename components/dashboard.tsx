"use client"

import { Calendar, Clock, FileText, TrendingUp, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const recentSubmissions = [
  { id: 1, title: "Exercice 3.2 - Boucles For", status: "Validé", score: 95, date: "Il y a 2 heures" },
  { id: 2, title: "Projet 1 - Calculatrice", status: "En attente", score: null, date: "Il y a 1 jour" },
  { id: 3, title: "Test - Variables", status: "Validé", score: 88, date: "Il y a 3 jours" },
]

const upcomingDeadlines = [
  { id: 1, title: "Projet 2 - Gestionnaire de données", date: "Dans 3 jours", priority: "high" },
  { id: 2, title: "Test - Fonctions avancées", date: "Dans 1 semaine", priority: "medium" },
  { id: 3, title: "Exercice 4.1 - Tableaux", date: "Dans 2 semaines", priority: "low" },
]

const courseProgress = [
  { id: 1, title: "Introduction à VBA", progress: 85, lessons: "12/14", color: "bg-blue-500" },
  { id: 2, title: "Variables et Types", progress: 60, lessons: "6/10", color: "bg-green-500" },
  { id: 3, title: "Boucles et Conditions", progress: 30, lessons: "3/10", color: "bg-purple-500" },
  { id: 4, title: "Fonctions Avancées", progress: 0, lessons: "0/12", color: "bg-orange-500" },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Bonjour Marie ! 👋</h1>
        <p className="text-blue-100">Continuez votre apprentissage VBA. Vous avez progressé de 15% cette semaine !</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cours terminés</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2/4</div>
            <p className="text-xs text-muted-foreground">50% de progression</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercices réussis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps d'étude</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12h</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% ce mois</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progression des cours</CardTitle>
            <CardDescription>Votre avancement dans chaque cours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {courseProgress.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${course.color}`} />
                    <span className="font-medium text-sm">{course.title}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{course.lessons} leçons</div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={course.progress} className="flex-1" />
                  <span className="text-sm font-medium w-12">{course.progress}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Soumissions récentes</CardTitle>
            <CardDescription>Vos derniers exercices et projets</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{submission.title}</p>
                  <p className="text-xs text-muted-foreground">{submission.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {submission.score && <span className="text-sm font-medium">{submission.score}%</span>}
                  <Badge variant={submission.status === "Validé" ? "default" : "secondary"}>{submission.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Échéances à venir
          </CardTitle>
          <CardDescription>Ne manquez pas vos prochaines dates limites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">{deadline.date}</p>
                </div>
                <Badge
                  variant={
                    deadline.priority === "high"
                      ? "destructive"
                      : deadline.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {deadline.priority === "high" ? "Urgent" : deadline.priority === "medium" ? "Important" : "Normal"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accès rapide</CardTitle>
          <CardDescription>Continuez là où vous vous êtes arrêté</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
              <BookOpen className="h-6 w-6" />
              <span>Continuer le cours</span>
            </Button>
            <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
              <FileText className="h-6 w-6" />
              <span>Nouvel exercice</span>
            </Button>
            <Button className="h-20 flex-col gap-2 bg-transparent" variant="outline">
              <TrendingUp className="h-6 w-6" />
              <span>Voir les statistiques</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
