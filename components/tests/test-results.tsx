"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Trophy,
  Clock,
  Target,
  BookOpen,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RotateCcw,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

interface TestResultsProps {
  testId: string
}

// Mock results data
const testResults = {
  1: {
    id: 1,
    title: "Quiz - Variables et Types",
    completedDate: "2024-01-25T15:30:00",
    score: 78,
    maxScore: 100,
    grade: "B+",
    passingScore: 70,
    passed: true,
    duration: 28, // minutes
    totalQuestions: 15,
    correctAnswers: 12,
    timePerQuestion: [120, 95, 180, 240, 150, 90, 200, 160, 110, 300, 85, 140, 190, 220, 175], // seconds
    classAverage: 72,
    attemptsUsed: 2,
    maxAttempts: 2,
    canRetake: false,
    questions: [
      {
        id: 1,
        question: "Quelle est la syntaxe correcte pour déclarer une variable entière en VBA ?",
        type: "multiple-choice",
        userAnswer: 0,
        correctAnswer: 0,
        isCorrect: true,
        explanation: "En VBA, on utilise le mot-clé 'Dim' suivi du nom de la variable et de son type.",
        points: 5,
        timeSpent: 120,
      },
      {
        id: 2,
        question: "Complétez le code suivant pour calculer la somme de deux nombres :",
        type: "code-completion",
        userAnswer: "a + b",
        correctAnswer: "a + b",
        isCorrect: true,
        explanation: "La fonction doit retourner la somme des deux paramètres a et b.",
        points: 10,
        timeSpent: 95,
      },
      {
        id: 3,
        question: "Quel type de données VBA peut stocker des valeurs décimales ?",
        type: "multiple-choice",
        userAnswer: 1,
        correctAnswer: 2,
        isCorrect: false,
        explanation: "Le type Double peut stocker des nombres à virgule flottante avec une grande précision.",
        points: 0,
        timeSpent: 180,
      },
      // ... more questions
    ],
  },
}

const gradeColors = {
  "A+": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  A: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "A-": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "B+": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  B: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "B-": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "C+": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  C: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "C-": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  D: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  F: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

export function TestResults({ testId }: TestResultsProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)
  const results = testResults[testId as keyof typeof testResults]

  if (!results) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">Résultats non trouvés</p>
        <Link href="/tests">
          <Button className="mt-4">Retour aux tests</Button>
        </Link>
      </div>
    )
  }

  const averageTimePerQuestion = results.timePerQuestion.reduce((a, b) => a + b, 0) / results.timePerQuestion.length

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href="/tests">
        <Button variant="outline" className="mb-4 bg-transparent">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux tests
        </Button>
      </Link>

      {/* Results Header */}
      <div
        className={`rounded-lg p-8 text-white ${
          results.passed ? "bg-gradient-to-r from-green-500 to-blue-500" : "bg-gradient-to-r from-red-500 to-orange-500"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="h-8 w-8" />
              <h1 className="text-3xl font-bold">{results.title}</h1>
              <Badge className={`${gradeColors[results.grade as keyof typeof gradeColors]} text-lg px-3 py-1`}>
                {results.grade}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-4xl font-bold">{results.score}%</div>
                <div className="text-sm opacity-90">Score obtenu</div>
              </div>
              <div>
                <div className="text-4xl font-bold">
                  {results.correctAnswers}/{results.totalQuestions}
                </div>
                <div className="text-sm opacity-90">Bonnes réponses</div>
              </div>
              <div>
                <div className="text-4xl font-bold">{results.duration} min</div>
                <div className="text-sm opacity-90">Temps utilisé</div>
              </div>
            </div>

            <Alert className={`${results.passed ? "bg-green-100 border-green-300" : "bg-red-100 border-red-300"}`}>
              <div className="flex items-center gap-2">
                {results.passed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <AlertDescription className={results.passed ? "text-green-800" : "text-red-800"}>
                  {results.passed
                    ? `Félicitations ! Vous avez réussi ce test avec ${results.score}% (minimum requis: ${results.passingScore}%)`
                    : `Test échoué. Vous avez obtenu ${results.score}% (minimum requis: ${results.passingScore}%)`}
                </AlertDescription>
              </div>
            </Alert>
          </div>

          <div className="lg:w-80">
            <Card className="bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm opacity-90">Votre score</span>
                    <span className="font-bold">{results.score}%</span>
                  </div>
                  <Progress value={results.score} className="bg-white/20" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-90">Moyenne de classe</span>
                    <span>{results.classAverage}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="opacity-90">Tentatives utilisées</span>
                    <span>
                      {results.attemptsUsed}/{results.maxAttempts}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score final</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.score}%</div>
            <p className="text-xs text-muted-foreground">
              {results.score >= results.passingScore ? "Réussi" : "Échoué"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(averageTimePerQuestion)}s</div>
            <p className="text-xs text-muted-foreground">Par question</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Précision</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((results.correctAnswers / results.totalQuestions) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Bonnes réponses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classement</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.score > results.classAverage ? "Au-dessus" : "En-dessous"}
            </div>
            <p className="text-xs text-muted-foreground">De la moyenne</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results */}
      <Tabs defaultValue="questions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questions">Détail des questions</TabsTrigger>
          <TabsTrigger value="analysis">Analyse temporelle</TabsTrigger>
          <TabsTrigger value="feedback">Recommandations</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Révision des questions</CardTitle>
              <CardDescription>Cliquez sur une question pour voir votre réponse et l'explication</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedQuestion === question.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedQuestion(selectedQuestion === question.id ? null : question.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            question.isCorrect
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{question.question}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {question.type === "multiple-choice" && "Choix multiple"}
                              {question.type === "code-completion" && "Code"}
                              {question.type === "open-ended" && "Ouverte"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {Math.round(question.timeSpent / 60)}:
                              {(question.timeSpent % 60).toString().padStart(2, "0")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{question.points} pts</span>
                        {question.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    {selectedQuestion === question.id && (
                      <div className="mt-4 pt-4 border-t space-y-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">Votre réponse :</h5>
                          <div className="bg-muted p-3 rounded text-sm">{question.userAnswer}</div>
                        </div>

                        {!question.isCorrect && (
                          <div>
                            <h5 className="font-medium text-sm mb-2">Réponse correcte :</h5>
                            <div className="bg-green-50 dark:bg-green-950 p-3 rounded text-sm">
                              {question.correctAnswer}
                            </div>
                          </div>
                        )}

                        <div>
                          <h5 className="font-medium text-sm mb-2">Explication :</h5>
                          <p className="text-sm text-muted-foreground">{question.explanation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyse du temps de réponse</CardTitle>
              <CardDescription>Temps passé sur chaque question</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.questions.map((question, index) => (
                  <div key={question.id} className="flex items-center gap-4">
                    <div className="w-12 text-sm font-medium">Q{index + 1}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm truncate">{question.question.substring(0, 50)}...</span>
                        <span className="text-sm font-medium">
                          {Math.round(question.timeSpent / 60)}:{(question.timeSpent % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            question.timeSpent > averageTimePerQuestion * 1.5
                              ? "bg-red-500"
                              : question.timeSpent < averageTimePerQuestion * 0.5
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                          style={{
                            width: `${Math.min((question.timeSpent / (averageTimePerQuestion * 2)) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Statistiques temporelles</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Temps total: {results.duration} minutes</div>
                  <div>Temps moyen par question: {Math.round(averageTimePerQuestion)}s</div>
                  <div>Question la plus rapide: {Math.min(...results.timePerQuestion)}s</div>
                  <div>Question la plus lente: {Math.max(...results.timePerQuestion)}s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommandations personnalisées</CardTitle>
              <CardDescription>Conseils pour améliorer vos performances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.score < results.passingScore && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Votre score est en dessous du seuil requis. Nous recommandons de réviser les concepts de base avant
                    de retenter le test.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">Points forts</h4>
                  <ul className="space-y-2 text-sm">
                    {results.correctAnswers > results.totalQuestions * 0.7 && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Bonne maîtrise générale des concepts
                      </li>
                    )}
                    {averageTimePerQuestion < 150 && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Gestion efficace du temps
                      </li>
                    )}
                    {results.score > results.classAverage && (
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        Performance au-dessus de la moyenne
                      </li>
                    )}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-orange-600">Axes d'amélioration</h4>
                  <ul className="space-y-2 text-sm">
                    {results.correctAnswers < results.totalQuestions * 0.6 && (
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Réviser les concepts fondamentaux
                      </li>
                    )}
                    {averageTimePerQuestion > 200 && (
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Améliorer la gestion du temps
                      </li>
                    )}
                    {results.questions.filter((q) => q.type === "code-completion" && !q.isCorrect).length > 0 && (
                      <li className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Pratiquer davantage la programmation VBA
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-800 dark:text-blue-200">Ressources recommandées</h4>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>• Revoir le cours "Variables et Types de données"</li>
                  <li>• Pratiquer avec les exercices interactifs</li>
                  <li>• Consulter la documentation VBA officielle</li>
                  <li>• Participer aux sessions de questions-réponses</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger les résultats
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Certificat de réussite
            </Button>

            {results.canRetake && (
              <Link href={`/tests/${testId}`}>
                <Button>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retenter le test
                </Button>
              </Link>
            )}

            <Link href="/tests">
              <Button variant="outline">Retour aux tests</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
