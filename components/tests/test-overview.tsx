"use client"

import { useState } from "react"
import { ArrowLeft, Clock, BookOpen, Target, AlertCircle, Calendar, Users, Trophy } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

interface TestOverviewProps {
  testId: string
}

// Mock data - in real app, this would come from API
const testData = {
  1: {
    id: 1,
    title: "Quiz - Variables et Types",
    description: "Évaluez vos connaissances sur les variables et types de données en VBA",
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
    prerequisites: ["Introduction à VBA", "Éditeur VBA"],
    instructions: [
      "Lisez attentivement chaque question avant de répondre",
      "Vous avez 30 minutes pour compléter ce quiz",
      "Vous pouvez revenir sur vos réponses avant la soumission finale",
      "Une note minimale de 70% est requise pour valider ce quiz",
      "Vous avez droit à 2 tentatives maximum",
      "Le timer commence dès que vous cliquez sur 'Commencer le test'",
    ],
    rules: [
      "Aucune aide extérieure n'est autorisée",
      "L'utilisation de documentation est interdite",
      "Vous devez rester sur la page du test",
      "Toute tentative de triche sera sanctionnée",
      "Sauvegardez régulièrement vos réponses",
    ],
    topics: [
      "Déclaration de variables",
      "Types de données primitifs",
      "Conversion de types",
      "Portée des variables",
      "Constantes et énumérations",
    ],
  },
}

const previousAttempts = [
  {
    id: 1,
    date: "2024-01-20T14:30:00",
    score: 65,
    maxScore: 100,
    duration: 28,
    status: "completed",
    grade: "C+",
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

function isTestAvailable(startDate: string, endDate: string) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  return now >= start && now <= end
}

function getTimeUntilStart(startDate: string) {
  const now = new Date()
  const start = new Date(startDate)
  const diffTime = start.getTime() - now.getTime()
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays > 1) return `Disponible dans ${diffDays} jours`
  if (diffHours > 1) return `Disponible dans ${diffHours} heures`
  return "Disponible maintenant"
}

export function TestOverview({ testId }: TestOverviewProps) {
  const [showInstructions, setShowInstructions] = useState(true)
  const test = testData[testId as keyof typeof testData]

  if (!test) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Test non trouvé</p>
        <Link href="/tests">
          <Button className="mt-4">Retour aux tests</Button>
        </Link>
      </div>
    )
  }

  const isAvailable = isTestAvailable(test.startDate, test.endDate)
  const hasAttemptsLeft = previousAttempts.length < test.attempts
  const canTakeTest = isAvailable && hasAttemptsLeft

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/tests">
        <Button variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux tests
        </Button>
      </Link>

      {/* Test Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold">{test.title}</h1>
              <Badge className={`${typeColors[test.type as keyof typeof typeColors]} text-sm`}>{test.type}</Badge>
              <Badge className={`${difficultyColors[test.difficulty as keyof typeof difficultyColors]} text-sm`}>
                {test.difficulty}
              </Badge>
            </div>
            <p className="text-indigo-100 text-lg mb-4">{test.description}</p>
            <p className="text-indigo-200">Matière: {test.subject}</p>
          </div>

          <div className="lg:w-80">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">{test.duration}</div>
                    <div className="text-sm text-indigo-200">minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{test.questions}</div>
                    <div className="text-sm text-indigo-200">questions</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{test.passingScore}%</div>
                    <div className="text-sm text-indigo-200">requis</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{test.attempts - previousAttempts.length}</div>
                    <div className="text-sm text-indigo-200">tentatives</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Informations du test
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Durée</div>
                    <div className="text-sm text-muted-foreground">{test.duration} minutes</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Questions</div>
                    <div className="text-sm text-muted-foreground">{test.questions} questions</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Score requis</div>
                    <div className="text-sm text-muted-foreground">{test.passingScore}% minimum</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Tentatives</div>
                    <div className="text-sm text-muted-foreground">{test.attempts} maximum</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Disponible</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(test.startDate).toLocaleDateString("fr-FR")} -{" "}
                      {new Date(test.endDate).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Statut</div>
                    <div className="text-sm text-muted-foreground">
                      {isAvailable ? "Disponible" : getTimeUntilStart(test.startDate)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {test.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Prérequis</CardTitle>
                <CardDescription>Assurez-vous d'avoir complété ces éléments avant de commencer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {test.prerequisites.map((prereq, index) => (
                    <Badge key={index} variant="outline">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Topics Covered */}
          <Card>
            <CardHeader>
              <CardTitle>Sujets couverts</CardTitle>
              <CardDescription>Ce test évalue vos connaissances sur les sujets suivants</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {test.topics.map((topic, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-sm">{topic}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
              <CardDescription>Lisez attentivement avant de commencer le test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Consignes générales</h4>
                <ul className="space-y-1">
                  {test.instructions.map((instruction, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Règles importantes</h4>
                <ul className="space-y-1">
                  {test.rules.map((rule, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Start Test Card */}
          <Card>
            <CardHeader>
              <CardTitle>Commencer le test</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAvailable && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{getTimeUntilStart(test.startDate)}</AlertDescription>
                </Alert>
              )}

              {!hasAttemptsLeft && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Vous avez épuisé toutes vos tentatives pour ce test.</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tentatives utilisées</span>
                  <span>
                    {previousAttempts.length}/{test.attempts}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(previousAttempts.length / test.attempts) * 100}%` }}
                  />
                </div>
              </div>

              {canTakeTest ? (
                <Link href={`/tests/${testId}/take`} className="w-full">
                  <Button className="w-full" size="lg">
                    Commencer le test
                  </Button>
                </Link>
              ) : (
                <Button disabled className="w-full" size="lg">
                  Test non disponible
                </Button>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Le timer commencera dès que vous cliquerez sur "Commencer"
              </p>
            </CardContent>
          </Card>

          {/* Previous Attempts */}
          {previousAttempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Tentatives précédentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {previousAttempts.map((attempt) => (
                    <div key={attempt.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{attempt.grade}</Badge>
                        <span className="text-sm font-medium">{attempt.score}%</span>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Date: {new Date(attempt.date).toLocaleDateString("fr-FR")}</div>
                        <div>Durée: {attempt.duration} minutes</div>
                      </div>
                      <Link href={`/tests/${testId}/results`}>
                        <Button variant="outline" size="sm" className="w-full mt-2 bg-transparent">
                          Voir les détails
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
