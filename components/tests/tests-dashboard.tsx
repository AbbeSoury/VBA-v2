"use client"

import { useState } from "react"
import { Search, Filter, Clock, Trophy, BookOpen, AlertCircle, Target } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

const upcomingTests = [
  {
    id: 1,
    title: "Quiz - Variables et Types",
    type: "Quiz",
    subject: "Fondamentaux VBA",
    difficulty: "Débutant",
    duration: 30,
    questions: 15,
    startDate: "2024-01-25T09:00:00",
    endDate: "2024-01-25T23:59:59",
    attempts: 2,
    passingScore: 70,
    status: "available",
  },
  {
    id: 2,
    title: "Contrôle - Boucles et Conditions",
    type: "Contrôle",
    subject: "Structures de contrôle",
    difficulty: "Intermédiaire",
    duration: 60,
    questions: 25,
    startDate: "2024-01-28T14:00:00",
    endDate: "2024-01-28T16:00:00",
    attempts: 1,
    passingScore: 75,
    status: "upcoming",
  },
  {
    id: 3,
    title: "Examen Final - VBA Complet",
    type: "Examen final",
    subject: "Tous les modules",
    difficulty: "Avancé",
    duration: 120,
    questions: 50,
    startDate: "2024-02-15T09:00:00",
    endDate: "2024-02-15T12:00:00",
    attempts: 1,
    passingScore: 80,
    status: "locked",
  },
]

const practiceTests = [
  {
    id: 4,
    title: "Entraînement - Fonctions de base",
    type: "Pratique",
    subject: "Fonctions VBA",
    difficulty: "Débutant",
    duration: 45,
    questions: 20,
    attempts: "unlimited",
    status: "available",
  },
  {
    id: 5,
    title: "Simulation - Examen blanc",
    type: "Pratique",
    subject: "Révision générale",
    difficulty: "Intermédiaire",
    duration: 90,
    questions: 40,
    attempts: "unlimited",
    status: "available",
  },
]

const completedTests = [
  {
    id: 6,
    title: "Quiz - Introduction VBA",
    type: "Quiz",
    subject: "Introduction",
    completedDate: "2024-01-20",
    score: 85,
    maxScore: 100,
    grade: "B+",
    attempts: 1,
    duration: 25,
  },
  {
    id: 7,
    title: "Contrôle - Variables",
    type: "Contrôle",
    subject: "Variables et Types",
    completedDate: "2024-01-18",
    score: 92,
    maxScore: 100,
    grade: "A-",
    attempts: 1,
    duration: 45,
  },
]

const typeColors = {
  Quiz: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Contrôle: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "Examen final": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Pratique: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

const difficultyColors = {
  Débutant: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Intermédiaire: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Avancé: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

function getTimeUntilTest(startDate: string) {
  const now = new Date()
  const start = new Date(startDate)
  const diffTime = start.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))

  if (diffDays > 1) return `Dans ${diffDays} jours`
  if (diffHours > 1) return `Dans ${diffHours} heures`
  if (diffTime > 0) return "Bientôt disponible"
  return "Disponible maintenant"
}

export function TestsDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const filterTests = (tests: any[]) => {
    return tests.filter((test) => {
      const matchesSearch =
        test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.subject.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || test.type === typeFilter
      const matchesDifficulty = difficultyFilter === "all" || test.difficulty === difficultyFilter
      const matchesSubject = subjectFilter === "all" || test.subject.includes(subjectFilter)

      return matchesSearch && matchesType && matchesDifficulty && matchesSubject
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Tests et Examens</h1>
        <p className="text-indigo-100">Évaluez vos connaissances et suivez votre progression</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests à venir</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTests.filter((t) => t.status !== "locked").length}</div>
            <p className="text-xs text-muted-foreground">Prochains 7 jours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests terminés</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests.length}</div>
            <p className="text-xs text-muted-foreground">Ce semestre</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score moyen</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(completedTests.reduce((acc, test) => acc + test.score, 0) / completedTests.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Tous les tests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps d'étude</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests.reduce((acc, test) => acc + test.duration, 0)} min</div>
            <p className="text-xs text-muted-foreground">Temps total</p>
          </CardContent>
        </Card>
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
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type de test" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="Quiz">Quiz</SelectItem>
                <SelectItem value="Contrôle">Contrôle</SelectItem>
                <SelectItem value="Examen final">Examen final</SelectItem>
                <SelectItem value="Pratique">Pratique</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulté" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes difficultés</SelectItem>
                <SelectItem value="Débutant">Débutant</SelectItem>
                <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                <SelectItem value="Avancé">Avancé</SelectItem>
              </SelectContent>
            </Select>

            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Matière" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes matières</SelectItem>
                <SelectItem value="Fondamentaux">Fondamentaux VBA</SelectItem>
                <SelectItem value="Structures">Structures de contrôle</SelectItem>
                <SelectItem value="Fonctions">Fonctions VBA</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setTypeFilter("all")
                setDifficultyFilter("all")
                setSubjectFilter("all")
              }}
            >
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">Tests à venir</TabsTrigger>
          <TabsTrigger value="practice">Tests d'entraînement</TabsTrigger>
          <TabsTrigger value="completed">Tests terminés</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {filterTests(upcomingTests).map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <Badge className={typeColors[test.type as keyof typeof typeColors]}>{test.type}</Badge>
                      <Badge className={difficultyColors[test.difficulty as keyof typeof difficultyColors]}>
                        {test.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{test.subject}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium mb-1">{getTimeUntilTest(test.startDate)}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(test.startDate).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{test.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{test.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{test.passingScore}% requis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{test.attempts} tentative(s)</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {test.status === "available" ? (
                    <Link href={`/tests/${test.id}`}>
                      <Button>Voir le test</Button>
                    </Link>
                  ) : test.status === "upcoming" ? (
                    <Button disabled>Pas encore disponible</Button>
                  ) : (
                    <Button disabled>Prérequis non remplis</Button>
                  )}
                  <Button variant="outline">Détails</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          {filterTests(practiceTests).map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <Badge className={typeColors[test.type as keyof typeof typeColors]}>{test.type}</Badge>
                      <Badge className={difficultyColors[test.difficulty as keyof typeof difficultyColors]}>
                        {test.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{test.subject}</CardDescription>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    Tentatives illimitées
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{test.duration} min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{test.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Pas de note minimale</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/tests/${test.id}`}>
                    <Button>Commencer l'entraînement</Button>
                  </Link>
                  <Button variant="outline">Voir les résultats précédents</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filterTests(completedTests).map((test) => (
            <Card key={test.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{test.title}</CardTitle>
                      <Badge className={typeColors[test.type as keyof typeof typeColors]}>{test.type}</Badge>
                      <Badge variant="outline" className="text-lg font-bold">
                        {test.grade}
                      </Badge>
                    </div>
                    <CardDescription>{test.subject}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold mb-1">{test.score}%</div>
                    <div className="text-xs text-muted-foreground">
                      Terminé le {new Date(test.completedDate).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Score obtenu</span>
                    <span className="font-medium">
                      {test.score}/{test.maxScore} points
                    </span>
                  </div>
                  <Progress value={test.score} className="h-2" />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tentatives:</span>
                      <span>{test.attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée:</span>
                      <span>{test.duration} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/tests/${test.id}/results`}>
                      <Button variant="outline">Voir les détails</Button>
                    </Link>
                    <Button variant="outline">Télécharger le certificat</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
