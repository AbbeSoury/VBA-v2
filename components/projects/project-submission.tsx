"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, Download, MessageSquare, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjectSubmissionProps {
  projectId: string
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadDate: Date
}

interface Submission {
  id: number
  date: string
  files: UploadedFile[]
  description: string
  status: "pending" | "approved" | "rejected" | "needs_revision"
  score?: number
  feedback?: string
  submittedBy: string
}

const mockSubmissions: Submission[] = [
  {
    id: 1,
    date: "2024-01-20 14:30",
    files: [
      {
        id: "1",
        name: "GestionStock_v1.xlsm",
        size: 2456789,
        type: "application/vnd.ms-excel.sheet.macroEnabled.12",
        uploadDate: new Date(),
      },
      { id: "2", name: "Documentation.pdf", size: 1234567, type: "application/pdf", uploadDate: new Date() },
    ],
    description:
      "Première version du système de gestion de stock avec toutes les fonctionnalités de base implémentées.",
    status: "approved",
    score: 85,
    feedback:
      "Excellent travail ! Le système fonctionne bien et l'interface est intuitive. Quelques améliorations possibles sur la gestion des erreurs.",
    submittedBy: "Marie Dubois",
  },
  {
    id: 2,
    date: "2024-01-18 16:45",
    files: [
      {
        id: "3",
        name: "GestionStock_draft.xlsm",
        size: 1987654,
        type: "application/vnd.ms-excel.sheet.macroEnabled.12",
        uploadDate: new Date(),
      },
    ],
    description: "Version préliminaire pour validation de l'approche.",
    status: "needs_revision",
    feedback:
      "Bon début, mais il manque la gestion des alertes de stock et les rapports. Veuillez compléter ces fonctionnalités.",
    submittedBy: "Marie Dubois",
  },
]

const statusLabels = {
  pending: "En attente",
  approved: "Approuvé",
  rejected: "Rejeté",
  needs_revision: "Révision nécessaire",
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  needs_revision: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getFileIcon(type: string) {
  if (type.includes("excel") || type.includes("spreadsheet")) {
    return (
      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded flex items-center justify-center">
        <FileText className="h-4 w-4 text-green-600 dark:text-green-300" />
      </div>
    )
  }
  if (type.includes("pdf")) {
    return (
      <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded flex items-center justify-center">
        <FileText className="h-4 w-4 text-red-600 dark:text-red-300" />
      </div>
    )
  }
  return (
    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded flex items-center justify-center">
      <FileText className="h-4 w-4 text-blue-600 dark:text-blue-300" />
    </div>
  )
}

export function ProjectSubmission({ projectId }: ProjectSubmissionProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [description, setDescription] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)
  const [submissions] = useState<Submission[]>(mockSubmissions)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = (files: File[]) => {
    const allowedTypes = [
      "application/vnd.ms-excel.sheet.macroEnabled.12", // .xlsm
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
      "application/pdf",
    ]

    const validFiles = files.filter((file) => allowedTypes.includes(file.type))

    const newFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadDate: new Date(),
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      alert("Veuillez ajouter au moins un fichier")
      return
    }

    // Logic to submit the project
    console.log("Submitting project:", { files: uploadedFiles, description })

    // Reset form
    setUploadedFiles([])
    setDescription("")

    alert("Projet soumis avec succès !")
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Soumettre votre projet
          </CardTitle>
          <CardDescription>
            Téléchargez vos fichiers de projet (.xlsm, .docx, .pdf) et ajoutez une description
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-lg font-medium">Glissez-déposez vos fichiers ici</p>
              <p className="text-sm text-muted-foreground">ou cliquez pour sélectionner des fichiers</p>
              <p className="text-xs text-muted-foreground">
                Formats acceptés: .xlsm, .docx, .pdf (max 10MB par fichier)
              </p>
            </div>
            <input
              type="file"
              multiple
              accept=".xlsm,.docx,.pdf"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Fichiers sélectionnés</h4>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-sm">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • Ajouté le {file.uploadDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description du projet</label>
            <Textarea
              placeholder="Décrivez votre projet, les fonctionnalités implémentées, les défis rencontrés..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-32"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={uploadedFiles.length === 0} className="flex-1">
              Soumettre le projet
            </Button>
            <Button variant="outline">Sauvegarder comme brouillon</Button>
          </div>
        </CardContent>
      </Card>

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des soumissions</CardTitle>
          <CardDescription>Consultez vos soumissions précédentes et les commentaires reçus</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p>Aucune soumission pour le moment</p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((submission) => (
                <div key={submission.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium">Soumission #{submission.id}</div>
                      <Badge className={statusColors[submission.status]}>{statusLabels[submission.status]}</Badge>
                      {submission.score && <Badge variant="outline">{submission.score}%</Badge>}
                    </div>
                    <div className="text-sm text-muted-foreground">{submission.date}</div>
                  </div>

                  <div className="space-y-4">
                    {/* Files */}
                    <div>
                      <h5 className="font-medium text-sm mb-2">Fichiers soumis</h5>
                      <div className="space-y-2">
                        {submission.files.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div className="flex items-center gap-2">
                              {getFileIcon(file.type)}
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <h5 className="font-medium text-sm mb-2">Description</h5>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded">{submission.description}</p>
                    </div>

                    {/* Feedback */}
                    {submission.feedback && (
                      <Alert>
                        <div className="flex items-start gap-2">
                          {submission.status === "approved" ? (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium text-sm mb-1">Commentaires de l'évaluateur</div>
                            <AlertDescription>{submission.feedback}</AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    )}

                    {/* Actions */}
                    {submission.status === "needs_revision" && (
                      <div className="flex gap-2">
                        <Button size="sm">Soumettre une révision</Button>
                        <Button variant="outline" size="sm">
                          Télécharger les fichiers
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Conseils pour la soumission</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Fichiers requis</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Fichier Excel principal (.xlsm)</li>
                <li>• Documentation utilisateur (.pdf ou .docx)</li>
                <li>• Guide d'installation (optionnel)</li>
                <li>• Fichiers de test (optionnel)</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-sm">Bonnes pratiques</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Testez votre code avant soumission</li>
                <li>• Commentez votre code VBA</li>
                <li>• Incluez des exemples de données</li>
                <li>• Documentez les fonctionnalités</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
