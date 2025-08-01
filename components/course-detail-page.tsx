"use client"

import { useState } from "react"
import {
  CheckCircle,
  Circle,
  Download,
  FileText,
  BookOpen,
  ImageIcon,
  Code,
  ArrowLeft,
  Clock,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const coursesData = {
  1: {
    id: 1,
    title: "VBA pour Excel - Débutant",
    description: "Apprenez les bases de VBA pour automatiser vos tâches Excel",
    level: "Débutant",
    duration: "8 heures",
    lessons: 12,
    exercises: 8,
    students: 1250,
    rating: 4.8,
    progress: 22,
    image: "excel-vba",
    chapters: [
      {
        id: 1,
        title: "Introduction à VBA",
        lessons: [
          { id: 1, title: "Qu'est-ce que VBA ?", duration: "10 min", completed: true, type: "lesson" },
          { id: 2, title: "L'éditeur VBA", duration: "15 min", completed: true, type: "lesson" },
          { id: 3, title: "Premier programme", duration: "20 min", completed: false, type: "lesson" },
          { id: 4, title: "Exercice : Hello World", duration: "15 min", completed: false, type: "exercise" },
        ],
      },
      {
        id: 2,
        title: "Variables et Types de données",
        lessons: [
          { id: 5, title: "Déclaration de variables", duration: "12 min", completed: false, type: "lesson" },
          { id: 6, title: "Types de données", duration: "18 min", completed: false, type: "lesson" },
          { id: 7, title: "Exercice : Calculatrice simple", duration: "30 min", completed: false, type: "exercise" },
        ],
      },
      {
        id: 3,
        title: "Structures de contrôle",
        lessons: [
          { id: 8, title: "Conditions If-Then-Else", duration: "15 min", completed: false, type: "lesson" },
          { id: 9, title: "Boucles For", duration: "20 min", completed: false, type: "lesson" },
          { id: 10, title: "Boucles While", duration: "18 min", completed: false, type: "lesson" },
          { id: 11, title: "Exercice : Traitement de données", duration: "25 min", completed: false, type: "exercise" },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: "VBA pour Word - Intermédiaire",
    description: "Automatisez vos documents Word avec VBA",
    level: "Intermédiaire",
    duration: "6 heures",
    lessons: 10,
    exercises: 6,
    students: 890,
    rating: 4.6,
    progress: 0,
    image: "word-vba",
    chapters: [
      {
        id: 1,
        title: "Manipulation de documents",
        lessons: [
          { id: 1, title: "Ouvrir et fermer des documents", duration: "12 min", completed: false, type: "lesson" },
          { id: 2, title: "Formatage automatique", duration: "18 min", completed: false, type: "lesson" },
          { id: 3, title: "Exercice : Mise en forme", duration: "20 min", completed: false, type: "exercise" },
        ],
      },
      {
        id: 2,
        title: "Gestion du contenu",
        lessons: [
          { id: 4, title: "Recherche et remplacement", duration: "15 min", completed: false, type: "lesson" },
          { id: 5, title: "Insertion d'éléments", duration: "20 min", completed: false, type: "lesson" },
          { id: 6, title: "Exercice : Génération de rapport", duration: "35 min", completed: false, type: "exercise" },
        ],
      },
    ],
  },
  3: {
    id: 3,
    title: "VBA Avancé - PowerPoint",
    description: "Créez des présentations dynamiques avec VBA",
    level: "Avancé",
    duration: "10 heures",
    lessons: 15,
    exercises: 12,
    students: 456,
    rating: 4.9,
    progress: 0,
    image: "powerpoint-vba",
    chapters: [
      {
        id: 1,
        title: "Automatisation des présentations",
        lessons: [
          { id: 1, title: "Création de slides dynamiques", duration: "25 min", completed: false, type: "lesson" },
          { id: 2, title: "Animation programmée", duration: "30 min", completed: false, type: "lesson" },
          {
            id: 3,
            title: "Exercice : Présentation interactive",
            duration: "45 min",
            completed: false,
            type: "exercise",
          },
        ],
      },
    ],
  },
}

const resources = [
  { id: 1, title: "Guide de référence VBA", type: "PDF", size: "2.3 MB" },
  { id: 2, title: "Exemples de code", type: "ZIP", size: "1.8 MB" },
  { id: 3, title: "Exercices supplémentaires", type: "PDF", size: "1.2 MB" },
  { id: 4, title: "Templates Excel", type: "XLSX", size: "1.5 MB" },
]

interface CourseDetailPageProps {
  courseId: string
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const course = coursesData[Number.parseInt(courseId)]
  const [selectedLesson, setSelectedLesson] = useState(course?.chapters[0]?.lessons[0] || null)

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Cours non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le cours demandé n'existe pas.</p>
          <Link href="/courses">
            <Button>Retour aux cours</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
  const completedLessons = course.chapters.reduce(
    (acc, chapter) => acc + chapter.lessons.filter((lesson) => lesson.completed).length,
    0,
  )
  const progressPercentage = Math.round((completedLessons / totalLessons) * 100)

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/courses">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-blue-100 mb-4">{course.description}</p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Progression:</span>
            <Progress value={progressPercentage} className="w-32 bg-blue-400" />
            <span className="text-sm font-medium">{progressPercentage}%</span>
          </div>
          <Badge variant="secondary" className="bg-blue-400 text-blue-900">
            {completedLessons}/{totalLessons} leçons
          </Badge>
          <Badge variant="outline" className="border-white text-white">
            {course.level}
          </Badge>
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-yellow-300 text-yellow-300" />
            <span>{course.rating}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {selectedLesson.type === "lesson" ? (
                        <BookOpen className="h-5 w-5" />
                      ) : (
                        <FileText className="h-5 w-5" />
                      )}
                      {selectedLesson.title}
                    </CardTitle>
                    <CardDescription>Durée: {selectedLesson.duration}</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      selectedLesson.type === "exercise"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }
                  >
                    {selectedLesson.type === "lesson" ? "Cours" : "Exercice"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image d'illustration */}
                <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center border">
                  <div className="text-center">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 text-blue-500" />
                    <p className="text-sm text-muted-foreground">Illustration - {selectedLesson.title}</p>
                  </div>
                </div>

                {/* Contenu selon le type */}
                {selectedLesson.type === "lesson" ? (
                  <div className="prose prose-sm max-w-none">
                    <h3 className="text-lg font-semibold mb-3">Introduction</h3>
                    <p className="text-muted-foreground mb-4">
                      Visual Basic for Applications (VBA) est un langage de programmation développé par Microsoft. Il
                      est intégré dans la plupart des applications Microsoft Office, permettant d'automatiser des tâches
                      répétitives et de créer des solutions personnalisées.
                    </p>

                    <h4 className="text-md font-semibold mb-2">Concepts clés</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
                      <li>VBA est un langage orienté objet</li>
                      <li>Il permet d'interagir avec les applications Office</li>
                      <li>Les macros sont écrites en VBA</li>
                      <li>L'éditeur VBA est accessible via Alt + F11</li>
                    </ul>

                    <h4 className="text-md font-semibold mb-2 flex items-center gap-2">
                      <Code className="h-4 w-4" />
                      Exemple pratique
                    </h4>
                    <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-4">
                      <div className="text-green-600 mb-1">{"' Premier programme VBA"}</div>
                      <div className="text-blue-600">Sub</div>{" "}
                      <span className="text-purple-600">MonPremierProgramme</span>
                      ()
                      <br />
                      <span className="ml-4">MsgBox </span>
                      <span className="text-orange-600">"Bonjour le monde !"</span>
                      <br />
                      <div className="text-blue-600">End Sub</div>
                    </div>

                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                      <div className="flex items-start">
                        <div className="text-blue-400 mr-2">💡</div>
                        <div>
                          <p className="text-sm font-medium text-blue-800">Conseil pratique</p>
                          <p className="text-sm text-blue-700">
                            Utilisez toujours des noms explicites pour vos procédures et variables. Cela rendra votre
                            code plus lisible et maintenable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
                      <div className="flex items-start">
                        <div className="text-orange-400 mr-2">🎯</div>
                        <div>
                          <p className="text-sm font-medium text-orange-800">Objectif de l'exercice</p>
                          <p className="text-sm text-orange-700">
                            Créez votre premier programme VBA qui affiche un message de bienvenue personnalisé.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold">Instructions :</h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                        <li>Ouvrez l'éditeur VBA (Alt + F11)</li>
                        <li>Insérez un nouveau module</li>
                        <li>Créez une procédure Sub nommée "Bienvenue"</li>
                        <li>Utilisez MsgBox pour afficher un message personnalisé</li>
                        <li>Testez votre code</li>
                      </ol>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h5 className="font-medium mb-2">Code de départ :</h5>
                      <div className="font-mono text-sm">
                        <div className="text-blue-600">Sub</div> <span className="text-purple-600">Bienvenue</span>()
                        <br />
                        <span className="ml-4 text-muted-foreground">{"' Votre code ici"}</span>
                        <br />
                        <div className="text-blue-600">End Sub</div>
                      </div>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
                      <div className="flex items-start">
                        <div className="text-green-400 mr-2">✅</div>
                        <div>
                          <p className="text-sm font-medium text-green-800">Critères de réussite</p>
                          <ul className="text-sm text-green-700 mt-1 space-y-1">
                            <li>• Le programme s'exécute sans erreur</li>
                            <li>• Le message s'affiche correctement</li>
                            <li>• Le code est bien structuré</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Leçon précédente
                  </Button>
                  <Button size="sm">
                    {selectedLesson.type === "exercise" ? "Faire l'exercice" : "Leçon suivante"}
                  </Button>
                  <Button variant="outline" size="sm" className="ml-auto bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Chapter List */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu du cours</CardTitle>
              <CardDescription>
                {course.chapters.length} chapitres • {totalLessons} leçons
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.chapters.map((chapter) => (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center justify-between">
                    {chapter.title}
                    <Badge variant="outline" className="text-xs">
                      {chapter.lessons.length}
                    </Badge>
                  </h4>
                  <div className="space-y-1">
                    {chapter.lessons.map((lesson) => (
                      <button
                        key={lesson.id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-accent transition-colors ${
                          selectedLesson?.id === lesson.id ? "bg-accent" : ""
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
                        {lesson.type === "lesson" ? (
                          <BookOpen className="h-3 w-3 text-blue-500" />
                        ) : (
                          <FileText className="h-3 w-3 text-orange-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Statistiques du cours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Étudiants inscrits</span>
                <span className="font-medium">{course.students}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Note moyenne</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Durée totale</span>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Niveau</span>
                <Badge variant="outline" className="text-xs">
                  {course.level}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Download className="h-4 w-4" />
                Ressources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-2 border rounded-lg hover:bg-accent/50 transition-colors"
                >
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
