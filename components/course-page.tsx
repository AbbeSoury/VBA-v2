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
import Link from "next/link"

// Typage du cours selon l'API (à ajuster si besoin)
type Course = {
  id: number
  title: string
  description: string
  difficulty: string
  estimated_hours?: number // Ajouté pour la durée
  order_index?: number // Added for sorting
  lessons?: number
  exercises?: number
  students?: number
  rating?: number
  progress?: number
  image?: string
  chapters?: any[]
  thumbnail_url?: string
  professor?: string
  nblessons?: number // Added for lessons count
  nbexercices?: number // Added for exercises count
}

const resources = [
  { id: 1, title: "Guide de référence VBA", type: "PDF", size: "2.3 MB" },
  { id: 2, title: "Exemples de code", type: "ZIP", size: "1.8 MB" },
  { id: 3, title: "Exercices supplémentaires", type: "PDF", size: "1.2 MB" },
]

// Mapping pour afficher la difficulté en français
const difficultyLabels: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [exercises, setExercises] = useState<any[]>([])
  const [loadingExercises, setLoadingExercises] = useState(false)

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

  const handleCourseSelect = async (course: Course) => {
    console.log("🚀 Sélection du cours:", course.id)
    setSelectedCourse(course)
    setLoadingLessons(true)
    setLoadingExercises(true)
    setLessons([])
    setExercises([])
    setSelectedLesson(null)
    try {
      // Utilisation de l'endpoint RESTful /exercises?course_id=xxx
      const [lessonsResponse, exercisesResponse] = await Promise.all([
        fetch(`https://vba-v2.onrender.com/courses/${course.id}/lessons`),
        fetch(`https://vba-v2.onrender.com/exercises?course_id=${course.id}`)
      ])
      console.log("📥 Status:", lessonsResponse.status, exercisesResponse.status);
      const lessonsData = lessonsResponse.ok ? await lessonsResponse.json() : [];
      const exercisesData = exercisesResponse.ok ? await exercisesResponse.json() : [];
      // Ajouter le type d'affichage sans écraser le type original
      const exercisesWithDisplayType = exercisesData.map((ex: any) => ({
        ...ex,
        displayType: 'exercise', // Pour l'affichage dans la sidebar
        exerciseType: ex.type    // Garder le type original (qcm, code, etc.)
      }));
      console.log("📚 Leçons API:", lessonsData);
      console.log("💪 Exercices avec displayType:", exercisesWithDisplayType);
      setLessons(lessonsData)
      setExercises(exercisesWithDisplayType)
      if (lessonsData.length > 0) {
        setSelectedLesson({ ...lessonsData[0], type: 'lesson' })
      } else if (exercisesWithDisplayType.length > 0) {
        setSelectedLesson({ ...exercisesWithDisplayType[0], type: 'exercise' })
      }
    } catch (error) {
      console.error("❌ Erreur:", error)
      setLessons([])
      setExercises([])
    } finally {
      setLoadingLessons(false)
      setLoadingExercises(false)
    }
  }

  const handleBackToCourses = () => {
    setSelectedCourse(null)
    setSelectedLesson(null)
    setLessons([])
    setExercises([])
    setLoadingLessons(false)
    setLoadingExercises(false)
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
      lessons={lessons}
      exercises={exercises}
      loadingLessons={loadingLessons}
      loadingExercises={loadingExercises}
    />
  )
}

function CoursesList({ courses, onCourseSelect }: { courses: Course[]; onCourseSelect: (course: Course) => void }) {
  // Tri côté frontend par order_index croissant
  const sortedCourses = [...courses].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Catalogue des Cours VBA</h1>
        <p className="text-blue-100">Choisissez votre parcours d'apprentissage VBA</p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedCourses.map((course) => (
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
                    course.difficulty === "beginner"
                      ? "default"
                      : course.difficulty === "intermediate"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {difficultyLabels[course.difficulty] || course.difficulty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{course.estimated_hours ? `${course.estimated_hours} heures` : '-'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {typeof course.nblessons === "number"
                      ? `${course.nblessons} leçon${course.nblessons > 1 ? 's' : ''}`
                      : '-'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {typeof course.nbexercices === "number"
                      ? `${course.nbexercices} exercice${course.nbexercices > 1 ? 's' : ''}`
                      : '-'}
                  </span>
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

              <Link href={`/courses/${course.id}`} className="w-full" passHref legacyBehavior>
                <a style={{ width: "100%" }}>
                  <Button className="w-full" variant={course.progress && course.progress > 0 ? "default" : "outline"}>
                    {course.progress && course.progress > 0 ? "Continuer" : "Commencer"}
                  </Button>
                </a>
              </Link>
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
  lessons,
  exercises,
  loadingLessons,
  loadingExercises,
}: {
  course: Course;
  selectedLesson: any;
  onLessonSelect: (lesson: any) => void;
  onBack: () => void;
  resources: { id: number; title: string; type: string; size: string }[];
  lessons: any[];
  exercises: any[];
  loadingLessons: boolean;
  loadingExercises: boolean;
}) {
  // Liste combinée et triée
  const combinedContent = [
    ...lessons.map(lesson => ({ ...lesson, displayType: 'lesson' })),
    ...exercises.map(exercise => ({ ...exercise, displayType: 'exercise' }))
  ].sort((a, b) => {
    // Trier par lesson_id d'abord (pour grouper par leçon), puis par order_index
    if (a.lesson_id && b.lesson_id && a.lesson_id !== b.lesson_id) {
      return a.lesson_id.localeCompare(b.lesson_id)
    }
    return (a.order_index || 0) - (b.order_index || 0)
  })

  // LOG DEBUG
  console.log("💪 Exercises reçus:", exercises)
  console.log("🧩 Combined content final:", combinedContent)

  const totalItems = lessons.length + exercises.length
  const completedItems = combinedContent.filter(item => item.completed).length
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

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
            {completedItems}/{totalItems} terminés
          </Badge>
          <Badge variant="outline" className="border-white text-white">
            {difficultyLabels[course.difficulty] || course.difficulty}
          </Badge>
          {course.estimated_hours && (
            <Badge variant="outline" className="border-white text-white">
              {course.estimated_hours} heures
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Content */}
        <div className="lg:col-span-2 space-y-6">
          {selectedLesson && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-3 text-2xl font-bold mb-2">
                      <div className={`p-2 rounded-lg ${
                        selectedLesson.type === 'lesson' 
                          ? 'bg-blue-100' 
                          : 'bg-orange-100'
                      }`}>
                        {selectedLesson.type === 'lesson' ? (
                          <BookOpen className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Code className="h-6 w-6 text-orange-600" />
                        )}
                      </div>
                      {selectedLesson.title}
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      {selectedLesson.type === 'lesson' 
                        ? `Durée: ${selectedLesson.estimated_minutes || 30} min`
                        : `Exercice • ${selectedLesson.max_score || 100} points • Difficulté: ${selectedLesson.difficulty || 'beginner'}`
                      }
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={
                    selectedLesson.type === 'lesson'
                      ? "bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                      : "bg-orange-50 text-orange-700 border-orange-200 px-3 py-1"
                  }>
                    {selectedLesson.type === 'lesson' ? 'Leçon' : 'Exercice'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Illustration */}
                <div className={`w-full h-56 rounded-xl flex items-center justify-center border shadow-sm ${
                  selectedLesson.type === 'lesson'
                    ? 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-100'
                    : 'bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 border-orange-100'
                }`}>
                  <div className="text-center space-y-3">
                    <div className="p-4 bg-white rounded-full shadow-md">
                      {selectedLesson.type === 'lesson' ? (
                        <BookOpen className="h-12 w-12 text-blue-500" />
                      ) : (
                        <Code className="h-12 w-12 text-orange-500" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-600">
                      {selectedLesson.type === 'lesson' ? 'Leçon' : 'Exercice'} - {selectedLesson.title}
                    </p>
                  </div>
                </div>

                {/* Contenu HTML riche pour leçon ET exercice */}
                <div className="prose prose-lg max-w-none">
                  {selectedLesson.content ? (
                    <div 
                      className="lesson-content"
                      dangerouslySetInnerHTML={{ 
                        __html: selectedLesson.content 
                      }}
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <p className="text-gray-500 italic">Contenu en cours de préparation...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📚 Contenu du cours</CardTitle>
              <div className="text-sm text-muted-foreground">
                {lessons.length} leçons • {exercises.length} exercices
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-xs mb-3 p-2 bg-gray-100 rounded">
                Debug: Lessons={lessons.length}, Exercises={exercises.length}, Loading={loadingLessons || loadingExercises}
              </div>
              {(loadingLessons || loadingExercises) ? (
                <div className="space-y-2">
                  <div className="text-sm text-blue-600">⏳ Chargement du contenu...</div>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              ) : combinedContent.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-xs text-green-600 mb-2">
                    ✅ {lessons.length} leçons + {exercises.length} exercices chargés
                  </div>
                  {combinedContent.map((item, index) => (
                    <button
                      key={`${item.displayType}-${item.id}`}
                      onClick={() => {
                        console.log(`🎯 Clic sur ${item.displayType}:`, item.title)
                        onLessonSelect(item)
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-accent transition-colors border ${
                        selectedLesson?.id === item.id && selectedLesson?.displayType === item.displayType
                          ? "bg-blue-50 border-blue-300 border-2" 
                          : "hover:border-gray-300"
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        item.displayType === 'lesson' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {item.displayType === 'lesson' ? (item.order_index || 0) + 1 : 'E'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.displayType === 'lesson' 
                            ? `${item.estimated_minutes || 30} min` 
                            : `${item.max_score || 100} pts • ${item.difficulty || 'beginner'}`
                          }
                        </p>
                      </div>
                      {item.displayType === 'lesson' ? (
                        <BookOpen className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Code className="h-4 w-4 text-orange-500" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-2">
                  <p className="text-sm font-medium text-red-600">❌ Aucun contenu trouvé</p>
                  <p className="text-xs text-gray-500">Vérifiez la console F12</p>
                </div>
              )}
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