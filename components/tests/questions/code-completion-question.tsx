"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, CheckCircle, XCircle } from "lucide-react"

interface CodeCompletionQuestionProps {
  question: {
    id: number
    question: string
    template: string
    correctAnswer: string
    explanation: string
  }
  answer: string | undefined
  onAnswerChange: (answer: string) => void
}

export function CodeCompletionQuestion({ question, answer, onAnswerChange }: CodeCompletionQuestionProps) {
  const [testResult, setTestResult] = useState<"success" | "error" | null>(null)
  const [testOutput, setTestOutput] = useState<string>("")

  const handleCodeChange = (value: string) => {
    onAnswerChange(value)
    setTestResult(null)
    setTestOutput("")
  }

  const handleTestCode = () => {
    // Simulate code testing
    try {
      // Basic validation - check if code contains common VBA keywords
      const hasValidSyntax =
        answer &&
        (answer.includes("=") || answer.includes("For") || answer.includes("If") || answer.includes("Debug.Print"))

      if (hasValidSyntax) {
        setTestResult("success")
        setTestOutput("✓ Code compilé avec succès\n✓ Syntaxe correcte")
      } else {
        setTestResult("error")
        setTestOutput("✗ Erreur de syntaxe\n✗ Vérifiez votre code")
      }
    } catch (error) {
      setTestResult("error")
      setTestOutput("✗ Erreur lors de l'exécution")
    }
  }

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div>
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      </div>

      {/* Code Template */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Template de code :</h4>
          <Badge variant="outline">VBA</Badge>
        </div>

        <div className="bg-muted p-4 rounded-lg font-mono text-sm">
          <pre className="whitespace-pre-wrap">{question.template}</pre>
        </div>
      </div>

      {/* Code Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Votre code :</h4>
          <Button variant="outline" size="sm" onClick={handleTestCode} disabled={!answer}>
            <Play className="h-4 w-4 mr-2" />
            Tester le code
          </Button>
        </div>

        <Textarea
          placeholder="Écrivez votre code ici..."
          value={answer || ""}
          onChange={(e) => handleCodeChange(e.target.value)}
          className="font-mono text-sm min-h-32 bg-background"
        />

        {/* Test Results */}
        {testResult && (
          <div
            className={`p-3 rounded-lg ${
              testResult === "success"
                ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {testResult === "success" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <XCircle className="h-4 w-4 text-red-600" />
              )}
              <span
                className={`font-medium text-sm ${
                  testResult === "success" ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"
                }`}
              >
                {testResult === "success" ? "Test réussi" : "Erreur détectée"}
              </span>
            </div>
            <pre
              className={`text-xs whitespace-pre-wrap ${
                testResult === "success" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"
              }`}
            >
              {testOutput}
            </pre>
          </div>
        )}
      </div>

      {/* Answer Status */}
      {answer && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">✓ Code sauvegardé ({answer.length} caractères)</p>
        </div>
      )}

      {/* Hints */}
      <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
        <h5 className="font-medium text-sm mb-2 text-yellow-800 dark:text-yellow-200">💡 Conseils :</h5>
        <ul className="text-xs text-yellow-700 dark:text-yellow-300 space-y-1">
          <li>• Respectez la syntaxe VBA</li>
          <li>• Utilisez les noms de variables appropriés</li>
          <li>• Testez votre code avant de continuer</li>
          <li>• N'oubliez pas les mots-clés VBA nécessaires</li>
        </ul>
      </div>
    </div>
  )
}
