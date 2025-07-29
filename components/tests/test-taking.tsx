"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Clock, Flag, Save, Send, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MultipleChoiceQuestion } from "./questions/multiple-choice-question"
import { CodeCompletionQuestion } from "./questions/code-completion-question"
import { OpenEndedQuestion } from "./questions/open-ended-question"
import Link from "next/link"

interface TestTakingProps {
  testId: string
}

// Mock test data
const testData = {
  1: {
    id: 1,
    title: "Quiz - Variables et Types",
    duration: 30, // minutes
    questions: [
      {
        id: 1,
        type: "multiple-choice",
        question: "Quelle est la syntaxe correcte pour déclarer une variable entière en VBA ?",
        code: `' Exemple de déclaration de variable
Sub ExempleDeclaration()
    ' Votre réponse ici
End Sub`,
        options: [
          "Dim monEntier As Integer",
          "Integer monEntier",
          "Declare monEntier As Integer",
          "Var monEntier: Integer",
        ],
        correctAnswer: 0,
        explanation: "En VBA, on utilise le mot-clé 'Dim' suivi du nom de la variable et de son type.",
      },
      {
        id: 2,
        type: "code-completion",
        question: "Complétez le code suivant pour calculer la somme de deux nombres :",
        template: `Function CalculerSomme(a As Integer, b As Integer) As Integer
    ' Complétez cette fonction
    CalculerSomme = 
End Function`,
        correctAnswer: "a + b",
        explanation: "La fonction doit retourner la somme des deux paramètres a et b.",
      },
      {
        id: 3,
        type: "multiple-choice",
        question: "Quel type de données VBA peut stocker des valeurs décimales ?",
        options: ["Integer", "String", "Double", "Boolean"],
        correctAnswer: 2,
        explanation: "Le type Double peut stocker des nombres à virgule flottante avec une grande précision.",
      },
      {
        id: 4,
        type: "open-ended",
        question: "Expliquez la différence entre les types Integer et Long en VBA.",
        minWords: 20,
        maxWords: 100,
        explanation:
          "Integer stocke des nombres de -32,768 à 32,767, tandis que Long peut stocker des nombres beaucoup plus grands.",
      },
      {
        id: 5,
        type: "code-completion",
        question: "Créez une boucle For qui affiche les nombres de 1 à 10 :",
        template: `Sub AfficherNombres()
    Dim i As Integer
    ' Complétez la boucle For
    
    Next i
End Sub`,
        correctAnswer: "For i = 1 To 10\n    Debug.Print i",
        explanation: "Une boucle For simple qui itère de 1 à 10 et affiche chaque valeur.",
      },
    ],
  },
}

export function TestTaking({ testId }: TestTakingProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: any }>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [tabSwitchWarnings, setTabSwitchWarnings] = useState(0)

  const test = testData[testId as keyof typeof testData]

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleSubmitTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Detect tab switching
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchWarnings((prev) => prev + 1)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))
  }

  const toggleFlag = (questionId: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const handleSaveDraft = () => {
    // Save current progress
    console.log("Saving draft...", { answers, flaggedQuestions, currentQuestion })
    // Show success message
  }

  const handleSubmitTest = () => {
    // Submit the test
    console.log("Submitting test...", { answers, timeSpent: 30 * 60 - timeLeft })
    // Redirect to results page
    window.location.href = `/tests/${testId}/results`
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

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

  const currentQ = test.questions[currentQuestion]
  const answeredQuestions = Object.keys(answers).length
  const progressPercentage = (answeredQuestions / test.questions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg">{test.title}</h1>
            <Badge variant="outline">
              Question {currentQuestion + 1} / {test.questions.length}
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className="flex items-center gap-2">
              <Clock className={`h-5 w-5 ${timeLeft < 300 ? "text-red-500" : "text-muted-foreground"}`} />
              <span className={`font-mono text-lg ${timeLeft < 300 ? "text-red-500 font-bold" : ""}`}>
                {formatTime(timeLeft)}
              </span>
            </div>

            {/* Progress */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Progression:</span>
              <div className="w-24 bg-muted rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }} />
              </div>
              <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>

              <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Soumettre
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la soumission</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir soumettre votre test ? Cette action est irréversible.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        Questions répondues: {answeredQuestions}/{test.questions.length}
                      </div>
                      <div>Temps restant: {formatTime(timeLeft)}</div>
                      <div>Questions marquées: {flaggedQuestions.size}</div>
                      <div>Progression: {Math.round(progressPercentage)}%</div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitTest} className="flex-1">
                        Confirmer la soumission
                      </Button>
                      <Button variant="outline" onClick={() => setShowSubmitDialog(false)} className="flex-1">
                        Continuer le test
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {tabSwitchWarnings > 0 && (
          <Alert className="rounded-none border-x-0 border-t-0 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Attention: {tabSwitchWarnings} changement(s) d'onglet détecté(s). Restez sur cette page pendant le test.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="pt-20 flex">
        {/* Question Navigation Sidebar */}
        <div className="w-64 fixed left-0 top-20 bottom-0 bg-muted/30 border-r border-border p-4 overflow-y-auto">
          <h3 className="font-medium mb-4">Navigation</h3>
          <div className="grid grid-cols-5 gap-2">
            {test.questions.map((_, index) => {
              const isAnswered = answers[index + 1] !== undefined
              const isFlagged = flaggedQuestions.has(index + 1)
              const isCurrent = index === currentQuestion

              return (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    w-10 h-10 rounded-full text-sm font-medium border-2 relative
                    ${isCurrent ? "border-blue-500 bg-blue-500 text-white" : "border-muted-foreground/20"}
                    ${isAnswered && !isCurrent ? "bg-green-100 border-green-500 text-green-700" : ""}
                    ${!isAnswered && !isCurrent ? "hover:border-muted-foreground/40" : ""}
                  `}
                >
                  {index + 1}
                  {isFlagged && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-orange-500 fill-orange-500" />}
                </button>
              )
            })}
          </div>

          <div className="mt-6 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-100 border-green-500 border-2" />
              <span>Répondu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span>Question actuelle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/20" />
              <span>Non répondu</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-orange-500 fill-orange-500" />
              <span>Marqué</span>
            </div>
          </div>

          <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent" onClick={toggleFullscreen}>
            {isFullscreen ? "Quitter" : "Plein écran"}
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64 p-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Question {currentQuestion + 1}</CardTitle>
                  <CardDescription>
                    {currentQ.type === "multiple-choice" && "Question à choix multiple"}
                    {currentQ.type === "code-completion" && "Complétion de code"}
                    {currentQ.type === "open-ended" && "Question ouverte"}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFlag(currentQ.id)}
                  className={flaggedQuestions.has(currentQ.id) ? "text-orange-600" : ""}
                >
                  <Flag className={`h-4 w-4 mr-2 ${flaggedQuestions.has(currentQ.id) ? "fill-orange-600" : ""}`} />
                  {flaggedQuestions.has(currentQ.id) ? "Marquée" : "Marquer"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Component */}
              {currentQ.type === "multiple-choice" && (
                <MultipleChoiceQuestion
                  question={currentQ}
                  answer={answers[currentQ.id]}
                  onAnswerChange={(answer) => handleAnswerChange(currentQ.id, answer)}
                />
              )}

              {currentQ.type === "code-completion" && (
                <CodeCompletionQuestion
                  question={currentQ}
                  answer={answers[currentQ.id]}
                  onAnswerChange={(answer) => handleAnswerChange(currentQ.id, answer)}
                />
              )}

              {currentQ.type === "open-ended" && (
                <OpenEndedQuestion
                  question={currentQ}
                  answer={answers[currentQ.id]}
                  onAnswerChange={(answer) => handleAnswerChange(currentQ.id, answer)}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>

                <div className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} sur {test.questions.length}
                </div>

                <Button
                  onClick={() => setCurrentQuestion(Math.min(test.questions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === test.questions.length - 1}
                >
                  Suivant
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
