"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface MultipleChoiceQuestionProps {
  question: {
    id: number
    question: string
    code?: string
    options: string[]
    correctAnswer: number | number[]
    explanation: string
  }
  answer: number | number[] | undefined
  onAnswerChange: (answer: number | number[]) => void
}

export function MultipleChoiceQuestion({ question, answer, onAnswerChange }: MultipleChoiceQuestionProps) {
  const isMultipleSelect = Array.isArray(question.correctAnswer)

  const handleSingleChoice = (value: string) => {
    onAnswerChange(Number.parseInt(value))
  }

  const handleMultipleChoice = (optionIndex: number, checked: boolean) => {
    const currentAnswers = Array.isArray(answer) ? answer : []
    if (checked) {
      onAnswerChange([...currentAnswers, optionIndex])
    } else {
      onAnswerChange(currentAnswers.filter((a) => a !== optionIndex))
    }
  }

  return (
    <div className="space-y-6">
      {/* Question Text */}
      <div>
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>

        {/* Code Block if present */}
        {question.code && (
          <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-4">
            <pre className="whitespace-pre-wrap">{question.code}</pre>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {isMultipleSelect ? (
          // Multiple choice with checkboxes
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-3">Sélectionnez toutes les réponses correctes :</p>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                <Checkbox
                  id={`option-${index}`}
                  checked={Array.isArray(answer) && answer.includes(index)}
                  onCheckedChange={(checked) => handleMultipleChoice(index, checked as boolean)}
                />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm bg-muted px-2 py-1 rounded">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        ) : (
          // Single choice with radio buttons
          <RadioGroup value={answer?.toString()} onValueChange={handleSingleChoice}>
            <p className="text-sm text-muted-foreground mb-3">Sélectionnez une seule réponse :</p>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm bg-muted px-2 py-1 rounded">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      {/* Answer Status */}
      {answer !== undefined && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            ✓ Réponse enregistrée
            {isMultipleSelect && Array.isArray(answer) && (
              <span className="ml-2">
                ({answer.length} option{answer.length > 1 ? "s" : ""} sélectionnée{answer.length > 1 ? "s" : ""})
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
