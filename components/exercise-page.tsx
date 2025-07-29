"use client"

import { useState } from "react"
import { CheckCircle, Clock, Code, Send, History } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const previousSubmissions = [
  {
    id: 1,
    date: "2024-01-15 14:30",
    score: 95,
    status: "Validé",
    feedback: "Excellent travail ! Votre code est propre et efficace.",
  },
  {
    id: 2,
    date: "2024-01-15 13:45",
    score: 78,
    status: "Validé",
    feedback: "Bon travail, mais vous pouvez optimiser la boucle For.",
  },
  {
    id: 3,
    date: "2024-01-15 13:20",
    score: 45,
    status: "Échec",
    feedback: "Erreur de syntaxe ligne 8. Vérifiez la déclaration de variable.",
  },
]

export function ExercisePage() {
  const [code, setCode] = useState(`Sub CalculerSomme()
    ' Votre code ici
    
End Sub`)

  return (
    <div className="space-y-6">
      {/* Exercise Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Exercice 3.2 - Boucles For</h1>
            <p className="text-purple-100">Créez une fonction qui calcule la somme des nombres de 1 à N</p>
          </div>
          <div className="text-right">
            <Badge variant="secondary" className="bg-purple-400 text-purple-900 mb-2">
              Intermédiaire
            </Badge>
            <div className="flex items-center gap-2 text-purple-100">
              <Clock className="h-4 w-4" />
              <span className="text-sm">30 minutes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Exercise Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold">Objectif</h3>
                <p className="text-muted-foreground">
                  Créez une fonction VBA qui prend un nombre N en paramètre et retourne la somme de tous les nombres
                  entiers de 1 à N en utilisant une boucle For.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Exigences</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Utilisez une boucle For pour calculer la somme</li>
                  <li>La fonction doit s'appeler "CalculerSomme"</li>
                  <li>Le paramètre d'entrée doit être de type Integer</li>
                  <li>La fonction doit retourner un Long</li>
                  <li>Gérez le cas où N est négatif ou zéro</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Exemple</h3>
                <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                  <div>CalculerSomme(5) → 15 (1+2+3+4+5)</div>
                  <div>CalculerSomme(10) → 55</div>
                  <div>CalculerSomme(0) → 0</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Éditeur de code
              </CardTitle>
              <CardDescription>Écrivez votre solution VBA ci-dessous</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-sm min-h-64 bg-muted"
                  placeholder="Écrivez votre code VBA ici..."
                />

                <div className="flex gap-2">
                  <Button className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Soumettre la solution
                  </Button>
                  <Button variant="outline">Tester le code</Button>
                  <Button variant="outline">Réinitialiser</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exercise Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulté</span>
                <Badge variant="secondary">Intermédiaire</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points</span>
                <span className="font-medium">50 pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tentatives</span>
                <span className="font-medium">3/∞</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temps restant</span>
                <span className="font-medium text-orange-600">25 min</span>
              </div>
            </CardContent>
          </Card>

          {/* Hints */}
          <Card>
            <CardHeader>
              <CardTitle>Conseils</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 Utilisez une variable pour accumuler la somme dans votre boucle
                </p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm text-green-800 dark:text-green-200">
                  💡 N'oubliez pas de déclarer vos variables avec Dim
                </p>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 Testez votre fonction avec différentes valeurs
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Previous Submissions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Historique des soumissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {previousSubmissions.map((submission) => (
              <div key={submission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{submission.date}</span>
                    <Badge variant={submission.status === "Validé" ? "default" : "destructive"}>
                      {submission.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{submission.feedback}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{submission.score}%</div>
                  {submission.status === "Validé" && <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-1" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
