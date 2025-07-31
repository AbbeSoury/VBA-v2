"use client"

import { useState, useEffect } from "react"
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
  Users,
  Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Typage du cours selon l'API (à ajuster si besoin)
type Course = {
  id: number
  title: string
  description: string
  level: string
  duration?: string
  lessons?: number
  exercises?: number
  students?: number
  rating?: number
  progress?: number
  image?: string
  chapters?: any[]
  thumbnail_url?: string
  professor?: string
}

const resources = [
  { id: 1, title: "Guide de référence VBA", type: "PDF", size: "2.3 MB" },
  { id: 2, title: "Exemples de code", type: "ZIP", size: "1.8 MB" },
  { id: 3, title: "Exercices supplémentaires", type: "PDF", size: "1.2 MB" },
]

export function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("https://vba-v2.onrender.com/courses")
        if (!res.ok) throw new Error("Erreur lors du chargement des cours")
        const data = await res.json()
        setCourses(data)
      } catch (err: any) {
        setError(err.message || "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course)
    setSelectedLesson(course.chapters?.[0]?.lessons?.[0] || null)
  }

  const handleBackToCourses = () => {
    setSelectedCourse(null)
    setSelectedLesson(null)
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  if (!selectedCourse) {
    return <CoursesList courses={courses} onCourseSelect={handleCourseSelect} />
  }

  return (
    <CourseDetail
      course={selectedCourse}
      selectedLesson={selectedLesson}
      onLessonSelect={setSelectedLesson}
      onBack={handleBackToCourses}
      resources={resources}
    />
  )
}

function CoursesList({ courses, onCourseSelect }: { courses: Course[]; onCourseSelect: (course: Course) => void }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Catalogue des Cours VBA</h1>
        <p className="text-blue-100">Choisissez votre parcours d'apprentissage VBA</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card
            key={course.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCourseSelect(course)}
          >
            <CardHeader>
              {/* Affichage de la vignette si dispo, sinon icône */}
              <div className="w-full h-32 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="object-cover w-full h-32"
                  />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 mx-auto mb-1 text-blue-500" />
                    <p className="text-xs text-muted-foreground">{course.image}</p>
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1">{course.title}</CardTitle>
                  <CardDescription className="text-sm">{course.description}</CardDescription>
                </div>
                <Badge
                  variant={
                    course.level === "Débutant"
                      ? "default"
                      : course.level === "Intermédiaire"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {course.level}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.duration || '-'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{course.lessons ?? '-'} leçons</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{course.exercises ?? '-'} exercices</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{course.students ?? '-'}</span>
                </div>
              </div>

              {/* Professeur */}
              {course.professor && (
                <div className="text-sm text-muted-foreground">
                  Professeur : <span className="font-medium">{course.professor}</span>
                </div>
              )}

              {/* Rating */}
              {course.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{course.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({course.students ?? '-'} étudiants)
                  </span>
                </div>
              )}

              {/* Progress */}
              {course.progress && course.progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              )}

              <Button className="w-full" variant={course.progress && course.progress > 0 ? "default" : "outline"}>
                {course.progress && course.progress > 0 ? "Continuer" : "Commencer"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Correction des types pour CourseDetail et ses props
function CourseDetail({
  course,
  selectedLesson,
  onLessonSelect,
  onBack,
  resources,
}: {
  course: Course;
  selectedLesson: any;
  onLessonSelect: (lesson: any) => void;
  onBack: () => void;
  resources: { id: number; title: string; type: string; size: string }[];
}) {
  // Correction : gestion chapters potentiellement undefined
  const totalLessons = course.chapters?.reduce((acc: number, chapter: any) => acc + chapter.lessons.length, 0) ?? 0
  const completedLessons = course.chapters?.reduce(
    (acc: number, chapter: any) => acc + chapter.lessons.filter((lesson: any) => lesson.completed).length,
    0,
  ) ?? 0
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-white/20">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux cours
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-blue-100 mb-4">{course.description}</p>
        <div className="flex items-center gap-4">
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
                      selectedLesson.type === "exercise" ? "bg-orange-50 text-orange-700 border-orange-200" : ""
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
                      <div className="text-green-600 mb-1">{"// Premier programme VBA"}</div>
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
                        <span className="ml-4 text-muted-foreground">{"// Votre code ici"}</span>
                        <br />
                        <div className="text-blue-600">End Sub</div>
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
            </CardHeader>
            <CardContent className="space-y-4">
              {course.chapters?.map((chapter: any) => (
                <div key={chapter.id} className="space-y-2">
                  <h4 className="font-medium text-sm">{chapter.title}</h4>
                  <div className="space-y-1">
                    {chapter.lessons.map((lesson: any) => (
                      <button
                        key={lesson.id}
                        onClick={() => onLessonSelect(lesson)}
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
                          <BookOpen className="h-3 w-3 text-muted-foreground" />
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

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Ressources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource: { id: number; title: string; type: string; size: string }) => (
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