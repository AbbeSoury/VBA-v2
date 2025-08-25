"use client"

import { useEffect, useState } from "react"
import { CourseDetailPage } from "@/components/course-detail-page"
import { useParams, useRouter } from "next/navigation"

const resources = [
  { id: 1, title: "Guide de référence VBA", type: "PDF", size: "2.3 MB" },
  { id: 2, title: "Exemples de code", type: "ZIP", size: "1.8 MB" },
  { id: 3, title: "Exercices supplémentaires", type: "PDF", size: "1.2 MB" },
]

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const courseId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    Promise.all([
      fetch(`https://vba-v2.onrender.com/courses/${courseId}`),
      fetch(`https://vba-v2.onrender.com/courses/${courseId}/lessons`),
      fetch(`https://vba-v2.onrender.com/exercises?course_id=${courseId}`)
    ])
      .then(async ([courseRes, lessonsRes, exercisesRes]) => {
        if (!courseRes.ok) throw new Error("Cours introuvable");
        const courseData = await courseRes.json();
        const lessonsData = lessonsRes.ok ? await lessonsRes.json() : [];
        const exercisesDataRaw = exercisesRes.ok ? await exercisesRes.json() : [];
        // Ajouter le type d'affichage sans écraser le type original
        const exercisesData = exercisesDataRaw.map((ex: any) => ({
          ...ex,
          displayType: 'exercise', // Pour l'affichage dans la sidebar
          exerciseType: ex.type    // Garder le type original (qcm, code, etc.)
        }));
        setCourse(courseData);
        setLessons(lessonsData);
        setExercises(exercisesData);
        setSelectedLesson(lessonsData[0] || null);
      })
      .catch(() => {
        setCourse(null);
        setLessons([]);
        setExercises([]);
        setSelectedLesson(null);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="p-8 text-center">Chargement...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">Cours introuvable</div>;

  return (
    <CourseDetailPage
      course={course}
      lessons={lessons}
      exercises={exercises}
      selectedLesson={selectedLesson}
      onLessonSelect={setSelectedLesson}
      onBack={() => router.push("/courses")}
      resources={resources}
    />
  );
}