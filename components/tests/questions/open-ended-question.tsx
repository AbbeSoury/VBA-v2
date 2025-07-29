"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle } from "lucide-react"

interface OpenEndedQuestionProps {
  question: {
    id: number
    question: string
    minWords?: number
    maxWords?: number
    explanation: string
  }
  answer: string | undefined
  onAnswerChange: (answer: string) => void
}

export function OpenEndedQuestion({ question, answer, onAnswerChange }: OpenEndedQuestionProps) {
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    if (answer) {
      const words = answer
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
      setWordCount(words.length)
      setCharCount(answer.length)
    } else {
      setWordCount(0)
      setCharCount(0)
    }
  }, [answer])

  const handleTextChange = (value: string) => {
    onAnswerChange(value)
  }

  const isWordCountValid = () => {
    if (question.minWords && wordCount < question.minWords) return false
    if (question.maxWords && wordCount > question.maxWords) return false
    return true
  }

  const getWordCountStatus = () => {
    if (!question.minWords && !question.maxWords) return "neutral"
    if (question.minWords && wordCount < question.minWords) return "insufficient"
    if (question.maxWords && wordCount > question.maxWords) return "excessive"
    return "valid"
  }

  const wordCountStatus = getWordCountStatus()

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div>
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>
      </div>

      {/* Requirements */}
      {(question.minWords || question.maxWords) && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm text-blue-800 dark:text-blue-200">Exigences :</span>
          </div>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            {question.minWords && <li>• Minimum {question.minWords} mots</li>}
            {question.maxWords && <li>• Maximum {question.maxWords} mots</li>}
            <li>• Réponse claire et structurée</li>
            <li>• Utilisez des exemples si pertinent</li>
          </ul>
        </div>
      )}

      {/* Text Input */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Votre réponse :</h4>
          <div className="flex items-center gap-4">
            {/* Word Count */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Mots:</span>
              <Badge
                variant={
                  wordCountStatus === "valid"
                    ? "default"
                    : wordCountStatus === "insufficient"
                      ? "destructive"
                      : wordCountStatus === "excessive"
                        ? "destructive"
                        : "outline"
                }
              >
                {wordCount}
                {question.minWords && ` / ${question.minWords}+`}
                {question.maxWords && !question.minWords && ` / ${question.maxWords}`}
              </Badge>
            </div>

            {/* Character Count */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Caractères:</span>
              <Badge variant="outline">{charCount}</Badge>
            </div>
          </div>
        </div>

        <Textarea
          placeholder="Rédigez votre réponse ici... Soyez précis et détaillé."
          value={answer || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          className="min-h-40 resize-y"
        />

        {/* Word Count Feedback */}
        {wordCount > 0 && (
          <div
            className={`p-3 rounded-lg ${
              wordCountStatus === "valid"
                ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                : wordCountStatus === "insufficient"
                  ? "bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800"
                  : wordCountStatus === "excessive"
                    ? "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
                    : "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {wordCountStatus === "valid" ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  wordCountStatus === "valid"
                    ? "text-green-800 dark:text-green-200"
                    : wordCountStatus === "insufficient"
                      ? "text-yellow-800 dark:text-yellow-200"
                      : wordCountStatus === "excessive"
                        ? "text-red-800 dark:text-red-200"
                        : "text-blue-800 dark:text-blue-200"
                }`}
              >
                {wordCountStatus === "valid" && "Longueur de réponse appropriée"}
                {wordCountStatus === "insufficient" &&
                  `Il vous faut encore ${question.minWords! - wordCount} mot(s) minimum`}
                {wordCountStatus === "excessive" &&
                  `Vous dépassez de ${wordCount - question.maxWords!} mot(s) la limite`}
                {wordCountStatus === "neutral" && "Réponse en cours de rédaction"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Answer Status */}
      {answer && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">✓ Réponse sauvegardée automatiquement</p>
        </div>
      )}

      {/* Writing Tips */}
      <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-lg">
        <h5 className="font-medium text-sm mb-2 text-gray-800 dark:text-gray-200">✍️ Conseils de rédaction :</h5>
        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Structurez votre réponse avec une introduction, développement et conclusion</li>
          <li>• Utilisez des exemples concrets pour illustrer vos points</li>
          <li>• Relisez votre réponse avant de passer à la question suivante</li>
          <li>• Soyez précis dans votre vocabulaire technique</li>
        </ul>
      </div>
    </div>
  )
}
