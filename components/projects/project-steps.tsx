"use client"

import { useState } from "react"
import { CheckCircle, Circle, Clock, FileText, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ProjectStepsProps {
  projectId: string
}

const projectSteps = {
  1: [
    {
      id: 1,
      title: "Analyse et conception",
      description: "Analysez les besoins et concevez l'architecture du système",
      estimatedTime: "2-3 heures",
      status: "completed",
      deliverables: [
        "Diagramme de flux des données",
        "Maquette de l'interface utilisateur",
        "Liste des fonctionnalités requises",
      ],
      instructions: `
        Dans cette première étape, vous devez analyser les besoins du système de gestion de stock et concevoir son architecture.
        
        **Tâches à réaliser :**
        1. Identifiez les entités principales (Articles, Fournisseurs, Mouvements)
        2. Définissez les relations entre ces entités
        3. Créez une maquette de l'interface utilisateur
        4. Listez toutes les fonctionnalités nécessaires
        
        **Conseils :**
        - Pensez aux différents types d'utilisateurs
        - Considérez les rapports qui seront nécessaires
        - Prévoyez la gestion des erreurs
      `,
      codeExample: `
        ' Structure de base pour les données
        Type Article
            ID As Long
            Nom As String
            Reference As String
            QuantiteStock As Long
            SeuilAlerte As Long
            PrixUnitaire As Double
        End Type
      `,
      checklist: [
        { id: 1, text: "Diagramme de flux créé", completed: true },
        { id: 2, text: "Maquette interface réalisée", completed: true },
        { id: 3, text: "Liste fonctionnalités validée", completed: true },
      ],
    },
    {
      id: 2,
      title: "Création de la structure de données",
      description: "Mettez en place la structure de données et les feuilles Excel",
      estimatedTime: "3-4 heures",
      status: "in_progress",
      deliverables: [
        "Feuilles Excel structurées",
        "Tables de données formatées",
        "Validation des données mise en place",
      ],
      instructions: `
        Créez la structure de données de votre système de gestion de stock.
        
        **Tâches à réaliser :**
        1. Créez les feuilles : Articles, Mouvements, Fournisseurs, Dashboard
        2. Définissez les colonnes et formats de données
        3. Mettez en place la validation des données
        4. Créez les listes déroulantes nécessaires
        
        **Structure recommandée :**
        - Feuille "Articles" : ID, Nom, Référence, Stock, Seuil, Prix
        - Feuille "Mouvements" : Date, Article, Type, Quantité, Utilisateur
        - Feuille "Fournisseurs" : ID, Nom, Contact, Email
      `,
      codeExample: `
        Sub CreerStructureDonnees()
            ' Création des feuilles principales
            Dim wsArticles As Worksheet
            Set wsArticles = Worksheets.Add
            wsArticles.Name = "Articles"
            
            ' En-têtes pour la feuille Articles
            With wsArticles
                .Range("A1").Value = "ID"
                .Range("B1").Value = "Nom"
                .Range("C1").Value = "Référence"
                .Range("D1").Value = "Stock Actuel"
                .Range("E1").Value = "Seuil Alerte"
                .Range("F1").Value = "Prix Unitaire"
            End With
        End Sub
      `,
      checklist: [
        { id: 1, text: "Feuille Articles créée", completed: true },
        { id: 2, text: "Feuille Mouvements créée", completed: false },
        { id: 3, text: "Validation des données configurée", completed: false },
        { id: 4, text: "Listes déroulantes créées", completed: false },
      ],
    },
    {
      id: 3,
      title: "Interface utilisateur",
      description: "Développez l'interface utilisateur avec formulaires et boutons",
      estimatedTime: "4-5 heures",
      status: "not_started",
      deliverables: ["Formulaires de saisie", "Boutons d'action", "Interface de navigation"],
      instructions: `
        Créez une interface utilisateur intuitive pour votre système.
        
        **Tâches à réaliser :**
        1. Créez un formulaire pour ajouter/modifier des articles
        2. Développez l'interface de gestion des mouvements
        3. Ajoutez des boutons d'action sur chaque feuille
        4. Créez un menu de navigation principal
        
        **Bonnes pratiques :**
        - Utilisez des couleurs cohérentes
        - Ajoutez des icônes pour améliorer l'UX
        - Prévoyez des messages de confirmation
      `,
      codeExample: `
        Sub CreerFormulaireSaisie()
            ' Création d'un formulaire simple
            Dim ws As Worksheet
            Set ws = Worksheets("Articles")
            
            ' Boutons d'action
            Dim btnAjouter As Button
            Set btnAjouter = ws.Buttons.Add(10, 10, 100, 30)
            btnAjouter.Caption = "Ajouter Article"
            btnAjouter.OnAction = "AjouterArticle"
        End Sub
      `,
      checklist: [
        { id: 1, text: "Formulaire articles créé", completed: false },
        { id: 2, text: "Interface mouvements développée", completed: false },
        { id: 3, text: "Boutons d'action ajoutés", completed: false },
        { id: 4, text: "Menu navigation créé", completed: false },
      ],
    },
    {
      id: 4,
      title: "Logique métier",
      description: "Implémentez la logique de gestion des stocks",
      estimatedTime: "5-6 heures",
      status: "not_started",
      deliverables: [
        "Fonctions de gestion des articles",
        "Système de suivi des mouvements",
        "Calculs automatiques des stocks",
      ],
      instructions: `
        Développez la logique métier de votre système de gestion de stock.
        
        **Fonctionnalités à implémenter :**
        1. Ajouter/modifier/supprimer des articles
        2. Enregistrer les entrées et sorties de stock
        3. Calculer automatiquement les stocks actuels
        4. Générer des alertes pour les stocks faibles
        
        **Fonctions principales :**
        - AjouterArticle()
        - ModifierStock()
        - VerifierSeuilAlerte()
        - CalculerValeurStock()
      `,
      codeExample: `
        Function AjouterArticle(nom As String, ref As String, stock As Long) As Boolean
            Dim ws As Worksheet
            Set ws = Worksheets("Articles")
            
            ' Trouver la première ligne vide
            Dim derniereLigne As Long
            derniereLigne = ws.Cells(ws.Rows.Count, 1).End(xlUp).Row + 1
            
            ' Ajouter les données
            ws.Cells(derniereLigne, 1).Value = derniereLigne - 1 ' ID
            ws.Cells(derniereLigne, 2).Value = nom
            ws.Cells(derniereLigne, 3).Value = ref
            ws.Cells(derniereLigne, 4).Value = stock
            
            AjouterArticle = True
        End Function
      `,
      checklist: [
        { id: 1, text: "Fonction AjouterArticle implémentée", completed: false },
        { id: 2, text: "Gestion des mouvements développée", completed: false },
        { id: 3, text: "Calculs automatiques créés", completed: false },
        { id: 4, text: "Système d'alertes implémenté", completed: false },
      ],
    },
    {
      id: 5,
      title: "Rapports et finalisation",
      description: "Créez les rapports et finalisez le système",
      estimatedTime: "3-4 heures",
      status: "not_started",
      deliverables: ["Rapports de stock", "Tableau de bord", "Documentation utilisateur"],
      instructions: `
        Finalisez votre système avec des rapports et la documentation.
        
        **Tâches finales :**
        1. Créez un tableau de bord avec indicateurs clés
        2. Développez des rapports de stock automatisés
        3. Ajoutez la gestion des erreurs
        4. Rédigez la documentation utilisateur
        
        **Rapports à créer :**
        - État des stocks par article
        - Mouvements par période
        - Articles en rupture ou en alerte
        - Valorisation du stock
      `,
      codeExample: `
        Sub GenererRapportStock()
            Dim ws As Worksheet
            Set ws = Worksheets.Add
            ws.Name = "Rapport_Stock"
            
            ' En-têtes du rapport
            ws.Range("A1").Value = "Rapport de Stock - " & Date
            ws.Range("A3").Value = "Article"
            ws.Range("B3").Value = "Stock Actuel"
            ws.Range("C3").Value = "Seuil Alerte"
            ws.Range("D3").Value = "Statut"
            
            ' Logique de génération du rapport
            ' ...
        End Sub
      `,
      checklist: [
        { id: 1, text: "Tableau de bord créé", completed: false },
        { id: 2, text: "Rapports automatisés développés", completed: false },
        { id: 3, text: "Gestion d'erreurs ajoutée", completed: false },
        { id: 4, text: "Documentation rédigée", completed: false },
      ],
    },
  ],
}

const statusIcons = {
  completed: CheckCircle,
  in_progress: Circle,
  not_started: Circle,
}

const statusColors = {
  completed: "text-green-500",
  in_progress: "text-blue-500",
  not_started: "text-muted-foreground",
}

const statusLabels = {
  completed: "Terminé",
  in_progress: "En cours",
  not_started: "À faire",
}

export function ProjectSteps({ projectId }: ProjectStepsProps) {
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [stepChecklist, setStepChecklist] = useState<{ [key: string]: boolean }>({})

  const steps = projectSteps[projectId as keyof typeof projectSteps] || []

  const toggleChecklistItem = (stepId: number, itemId: number) => {
    const key = `${stepId}-${itemId}`
    setStepChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const markStepComplete = (stepId: number) => {
    // Logic to mark step as complete
    console.log(`Marking step ${stepId} as complete`)
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progression du projet</CardTitle>
          <CardDescription>Suivez votre avancement étape par étape</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Étapes terminées</span>
            <span className="text-sm text-muted-foreground">
              {steps.filter((step) => step.status === "completed").length} / {steps.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(steps.filter((step) => step.status === "completed").length / steps.length) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Steps Timeline */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const StatusIcon = statusIcons[step.status as keyof typeof statusIcons]
          const isExpanded = expandedStep === step.id

          return (
            <Card key={step.id} className="relative">
              {/* Timeline connector */}
              {index < steps.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-8 bg-border" />}

              <Collapsible open={isExpanded} onOpenChange={() => setExpandedStep(isExpanded ? null : step.id)}>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`h-6 w-6 ${statusColors[step.status as keyof typeof statusColors]}`} />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-muted-foreground">Étape {step.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {statusLabels[step.status as keyof typeof statusLabels]}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex-1">
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span>{step.description}</span>
                          <div className="flex items-center gap-1 text-xs">
                            <Clock className="h-3 w-3" />
                            {step.estimatedTime}
                          </div>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Instructions */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Instructions détaillées
                          </h4>
                          <div className="text-sm text-muted-foreground whitespace-pre-line bg-muted p-4 rounded-lg">
                            {step.instructions}
                          </div>
                        </div>

                        {/* Code Example */}
                        {step.codeExample && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Code className="h-4 w-4" />
                              Exemple de code
                            </h4>
                            <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto font-mono">
                              {step.codeExample}
                            </pre>
                          </div>
                        )}
                      </div>

                      {/* Checklist and Deliverables */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Liste de vérification</h4>
                          <div className="space-y-2">
                            {step.checklist.map((item) => (
                              <div key={item.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${step.id}-${item.id}`}
                                  checked={stepChecklist[`${step.id}-${item.id}`] || item.completed}
                                  onCheckedChange={() => toggleChecklistItem(step.id, item.id)}
                                />
                                <label
                                  htmlFor={`${step.id}-${item.id}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {item.text}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Livrables attendus</h4>
                          <ul className="space-y-1">
                            {step.deliverables.map((deliverable, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                {deliverable}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {step.status !== "completed" && (
                          <Button
                            onClick={() => markStepComplete(step.id)}
                            className="w-full"
                            variant={step.status === "in_progress" ? "default" : "outline"}
                          >
                            {step.status === "in_progress" ? "Marquer comme terminé" : "Commencer cette étape"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
