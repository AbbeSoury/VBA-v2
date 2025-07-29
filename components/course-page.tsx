"use client"

import { useState } from "react"
import { CheckCircle, Circle, Download, FileText, Play, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

const courseChapters = [
  {
    id: 1,
    title: "Introduction à VBA",
    lessons: [
      { id: 1, title: "Qu'est-ce que VBA ?", duration: "10 min", completed: true, type: "video" },
      { id: 2, title: "L'éditeur VBA", duration: "15 min", completed: true, type: "video" },
      { id: 3, title: "Premier programme", duration: "20 min", completed: false, type: "video" },
    ],
  },
  {
    id: 2,
    title: "Variables et Types de données",
    lessons: [
      { id: 4, title: "Déclaration de variables", duration: "12 min", completed: false, type: "video" },
      { id: 5, title: "Types de données", duration: "18 min", completed: false, type: "video" },
      { id: 6, title: "Exercice pratique", duration: "30 min", completed: false, type: "exercise" },
    ],
  },
  {
    id: 3,
    title: "Structures de contrôle",
    lessons: [
      { id: 7, title: "Conditions If-Then-Else", duration: "15 min", completed: false, type: "video" },
      { id: 8, title: "Boucles For", duration: "20 min", completed: false, type: "video" },
      { id: 9, title: "Boucles While", duration: "18 min", completed: false, type: "video" },
    ],
  },
]

const resources = [
  { id: 1, title: "Guide de référence VBA", type: "PDF", size: "2.3 MB" },
  { id: 2, title: "Exemples de code", type: "ZIP", size: "1.8 MB" },
  { id: 3, title: "Exercices supplémentaires", type: "PDF", size: "1.2 MB" },
]

export function CoursePage() {
  const [selectedLesson, setSelectedLesson] = useState(courseChapters[0].lessons[0])
  const [notes, setNotes] = useState("")

  const totalLessons = courseChapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
  const completedLessons = courseChapters.reduce(
    (acc, chapter) => acc + chapter.lessons.filter((lesson) => lesson.completed).length,
    0,
  )
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Cours VBA Complet</h1>
        <p className="text-blue-100 mb-4">Maîtrisez Visual Basic for Applications de A à Z</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Progression:</span>
            <Progress value={progressPercentage} className="w-32 bg-blue-400" />
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Badge variant="secondary" className="bg-blue-400 text-blue-900">
            {completedLessons}/{totalLessons} leçons
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video/Content Area */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {selectedLesson.type === "video" ? <Video className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                    {selectedLesson.title}
                  </CardTitle>
                  <CardDescription>Durée: {selectedLesson.duration}</CardDescription>
                </div>
                <Button size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Lire
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground">Contenu vidéo - {selectedLesson.title}</p>
                </div>
              </div>

              {selectedLesson.type === "video" && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Description de la leçon</h3>
                  <p className="text-muted-foreground">
                    Dans cette leçon, nous allons explorer les concepts fondamentaux de VBA. Vous apprendrez les bases
                    nécessaires pour commencer à programmer efficacement.
                  </p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Leçon précédente
                    </Button>
                    <Button size="sm">Leçon suivante</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes Section */}
          <Card>
            <CardHeader>
              <CardTitle>Mes notes</CardTitle>
              <CardDescription>Prenez des notes pendant votre apprentissage</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Écrivez vos notes ici..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-32"
              />
              <div className="flex justify-end mt-4">
                <Button size="sm">Sauvegarder</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chapter List */}
          <Card>
            <CardHeader>
              <CardTitle>Chapitres du cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseChapters.map((chapter) => (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="font-medium text-sm">{chapter.title}</h4>
                  <div className="space-y-1">
                    {chapter.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-accent transition-colors ${
                          selectedLesson.id === lesson.id ? "bg-accent" : ""
                        }`}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lesson.title}</p>
                          <p className="text-xs text-muted-foreground">{lesson.duration}</p>
                        </div>
                        {lesson.type === "video" ? (
                          <Video className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <FileText className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Ressources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{resource.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {resource.type} • {resource.size}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
