"use client"

import { useEffect, useState, useRef } from "react"
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
import { MultipleChoiceQuestion } from "@/components/tests/questions/multiple-choice-question"
import { CodeCompletionQuestion } from "@/components/tests/questions/code-completion-question"
import { OpenEndedQuestion } from "@/components/tests/questions/open-ended-question"

// SUPPRIMER toutes les données mockées (coursesData, etc)
// On suppose que ce composant reçoit bien les props : course, lessons, selectedLesson, etc.

const difficultyLabels: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export function CourseDetailPage({ course, lessons, exercises = [], selectedLesson, onLessonSelect, onBack, resources }: {
  course: any;
  lessons: any[];
  exercises?: any[];
  selectedLesson: any;
  onLessonSelect: (lesson: any) => void;
  onBack: () => void;
  resources: { id: number; title: string; type: string; size: string }[];
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const completedItemsRef = useRef<Set<string>>(new Set());

  // Synchroniser le ref avec le state
  useEffect(() => {
    completedItemsRef.current = completedItems;
  }, [completedItems]);

  // Fonction pour définir un cookie
  const setCookie = (name: string, value: string, days: number = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Fonction pour récupérer un cookie
  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  // Charger la progression depuis les cookies au montage
  useEffect(() => {
    const savedProgress = getCookie(`course-progress-${course?.id}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCompletedItems(new Set(progress));
      } catch (error) {
        console.error('Erreur lors du chargement de la progression:', error);
      }
    }
  }, [course?.id]);

  // Sauvegarder la progression dans les cookies
  const saveProgress = (newProgress: Set<string>) => {
    try {
      setCookie(`course-progress-${course?.id}`, JSON.stringify([...newProgress]), 365);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
    }
  };

  // Marquer un élément comme terminé
  const markAsCompleted = (itemId: string) => {
    const newProgress = new Set(completedItems);
    newProgress.add(itemId);
    setCompletedItems(newProgress);
    saveProgress(newProgress);
  };

  // Fonction personnalisée pour sélectionner une leçon et la marquer comme terminée
  const handleLessonSelect = (lesson: any) => {
    // Appeler la fonction originale
    onLessonSelect(lesson);
    
    // Marquer instantanément comme terminé si c'est une leçon
    if (lesson.displayType === 'lesson' && lesson.id && !completedItems.has(lesson.id)) {
      markAsCompleted(lesson.id);
    }
  };

  // Création de la liste combinée leçons + exercices (ordre : lessons puis exercises, à trier si besoin)
  const combinedContent = [
    ...(lessons?.map((l) => ({ ...l, displayType: 'lesson' })) || []),
    ...(exercises?.map((e) => ({ ...e, displayType: 'exercise' })) || [])
  ].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
  const nbLessons = combinedContent.filter(item => item.displayType === 'lesson').length
  const nbExercises = combinedContent.filter(item => item.displayType === 'exercise').length

  // Tri possible ici si tu veux un ordre précis (par order_index, etc.)
  const currentIndex = combinedContent.findIndex((l) => l.id === selectedLesson?.id && l.displayType === selectedLesson?.displayType)

  // Fonction pour obtenir le texte dynamique du bouton
  const getNavLabel = (item: any, prev = false) => {
    if (!item) return ''
    if (item.displayType === 'lesson') return prev ? 'Leçon précédente' : 'Leçon suivante'
    if (item.displayType === 'exercise') return prev ? 'Exercice précédent' : 'Exercice suivant'
    return prev ? 'Précédent' : 'Suivant'
  }

  // Fonction pour valider la réponse
  const handleValidateAnswer = () => {
    if (selectedAnswer === null) {
      alert("Veuillez sélectionner une réponse avant de valider.");
      return;
    }

    if (selectedLesson?.displayType === 'exercise' && selectedLesson?.test_cases?.[0]) {
      const testCase = selectedLesson.test_cases[0];
      const correct = selectedAnswer === testCase.correct_option_index;
      
      setIsCorrect(correct);
      setIsAnswered(true);
      setShowFeedback(true);
      
      // Marquer automatiquement l'exercice comme terminé si la réponse est correcte
      if (correct && selectedLesson?.id) {
        markAsCompleted(selectedLesson.id);
      }
    }
  };

  // Fonction pour réinitialiser l'exercice
  const handleResetExercise = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowFeedback(false);
  };

  // Fonction pour afficher le contenu interactif selon le type
  const renderInteractiveContent = (lesson: any) => {
    if (!lesson) return null
    if (lesson.displayType === 'exercise') {
      // QCM - gérer le type 'qcm' de l'API
      if ((lesson.exerciseType === 'multiple-choice' || lesson.type === 'qcm') && lesson.test_cases && lesson.test_cases.length > 0) {
        const testCase = lesson.test_cases[0]; // Prendre le premier test case
        return (
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-medium mb-4">{testCase.question}</h3>
              <div className="space-y-3">
                {testCase.options.map((option: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50">
                    <input
                      type="radio"
                      name={`exercise-${lesson.id}`}
                      id={`option-${index}`}
                      className="h-4 w-4 text-blue-600"
                      checked={selectedAnswer === index}
                      onChange={() => setSelectedAnswer(index)}
                      disabled={isAnswered}
                    />
                    <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-sm bg-muted px-2 py-1 rounded">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span>{option}</span>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              
              {/* Feedback de validation */}
              {showFeedback && (
                <div className={`mt-4 p-4 rounded-lg ${
                  isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      isCorrect ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isCorrect ? 'Correct !' : 'Incorrect'}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    isCorrect ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isCorrect 
                      ? 'Félicitations ! Votre réponse est correcte.' 
                      : `La bonne réponse était : ${String.fromCharCode(65 + testCase.correct_option_index)}. ${testCase.options[testCase.correct_option_index]}`
                    }
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                {!isAnswered ? (
                  <Button 
                    className="flex-1" 
                    onClick={handleValidateAnswer}
                    disabled={selectedAnswer === null}
                  >
                    Valider ma réponse
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={handleResetExercise}
                  >
                    Recommencer
                  </Button>
                )}
              </div>
            </div>
          </div>
        )
      }
      // Code
      if (lesson.exerciseType === 'code-completion' && lesson.vba_template) {
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium mb-2">Template de code :</h3>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                <pre className="whitespace-pre-wrap">{lesson.vba_template}</pre>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Votre code :</h3>
              <textarea
                className="w-full min-h-32 p-3 border rounded-lg font-mono text-sm"
                placeholder="Écrivez votre code ici..."
              />
              <div className="mt-3 flex gap-2">
                <Button variant="outline">Exécuter</Button>
                <Button>Vérifier</Button>
              </div>
            </div>
          </div>
        )
      }
      // Question ouverte
      if (lesson.exerciseType === 'open-ended' && lesson.description) {
        return (
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium mb-2">{lesson.description}</h3>
              <textarea
                className="w-full min-h-40 p-3 border rounded-lg"
                placeholder="Rédigez votre réponse ici..."
              />
              <div className="mt-3">
                <Button>Valider ma réponse</Button>
              </div>
            </div>
          </div>
        )
      }
      // Autres types - afficher les informations disponibles
      return (
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-medium mb-2">Exercice : {lesson.title}</h3>
            <p className="text-sm text-gray-700 mb-3">{lesson.description}</p>
            <div className="text-xs text-gray-600">
              <p>Type: {lesson.type}</p>
              <p>Difficulté: {lesson.difficulty}</p>
              <p>Score max: {lesson.max_score} points</p>
            </div>
          </div>
          {lesson.hints && lesson.hints.length > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2">💡 Conseils :</h4>
              <ul className="text-sm space-y-1">
                {lesson.hints.map((hint: string, index: number) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    }
    return null
  }

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
            <Progress value={combinedContent.length > 0 ? Math.round(((currentIndex + 1) / combinedContent.length) * 100) : 0} className="w-32 bg-blue-400" />
            <span className="text-sm font-medium">{combinedContent.length > 0 ? Math.round(((currentIndex + 1) / combinedContent.length) * 100) : 0}%</span>
          </div>
          <Badge variant="secondary" className="bg-blue-400 text-blue-900">
            {currentIndex + 1}/{combinedContent.length} éléments
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
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {selectedLesson.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Contenu HTML direct depuis la base - SEULEMENT pour les leçons */}
                {selectedLesson.displayType === 'lesson' && (
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
                )}

                {/* Affichage direct du contenu interactif pour les exercices */}
                {selectedLesson.displayType === 'exercise' && (
                  <div>{renderInteractiveContent(selectedLesson)}</div>
                )}

                {/* Navigation - combinée, style strictement conservé */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  {currentIndex > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLessonSelect(combinedContent[currentIndex - 1])}
                    >
                      {getNavLabel(combinedContent[currentIndex - 1], true)}
                    </Button>
                  )}
                  {currentIndex < combinedContent.length - 1 && (
                    <Button
                      size="sm"
                      onClick={() => onLessonSelect(combinedContent[currentIndex + 1])}
                    >
                      {getNavLabel(combinedContent[currentIndex + 1], false)}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Sidebar : afficher la liste combinée (leçons + exercices) */}
          <Card>
            <CardHeader>
              <CardTitle>Contenu du cours</CardTitle>
              <div className="text-sm text-muted-foreground">
                {nbLessons} leçon{nbLessons > 1 ? 's' : ''} • {nbExercises} exercice{nbExercises > 1 ? 's' : ''}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {combinedContent.length === 0 ? (
                <div className="text-muted-foreground text-center">Aucun contenu pour ce cours.</div>
              ) : (
                <div className="space-y-1">
                  {combinedContent.map((item, idx) => {
                    const isCompleted = completedItems.has(item.id);
                    const estimatedMinutes = item.estimated_minutes || 15;
                    
                    return (
                      <button
                        key={item.id + '-' + item.displayType}
                        onClick={() => handleLessonSelect(item)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          selectedLesson?.id === item.id && selectedLesson?.displayType === item.displayType 
                            ? "bg-gray-100" 
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {/* Statut de complétion automatique */}
                        <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
                          isCompleted ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                        
                        {/* Contenu principal */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">{estimatedMinutes} min</p>
                        </div>
                        
                        {/* Icône de type */}
                        {item.displayType === 'lesson' ? (
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-orange-500" />
                        )}
                      </button>
                    );
                  })}
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
