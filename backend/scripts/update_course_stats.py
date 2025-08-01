import psycopg2

# À compléter avec vos informations Supabase
DB_HOST = "db.romvoxveumfepfhfswex.supabase.co"
DB_NAME = "postgres"
DB_USER = "postgres"
DB_PASSWORD = "RJ5HO07s6emnfpVn"

def update_course_stats():
    conn = psycopg2.connect(
        host=DB_HOST,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD
    )
    cur = conn.cursor()

    # Récupérer tous les cours
    cur.execute("SELECT id, title FROM public.courses")
    courses = cur.fetchall()

    for course_id, title in courses:
        # Compter le nombre de lessons pour ce cours
        cur.execute(
            "SELECT COUNT(*) FROM public.lessons WHERE course_id = %s",
            (course_id,)
        )
        nblessons = cur.fetchone()[0]

        # Compter le nombre d'exercices pour ce cours
        cur.execute(
            "SELECT COUNT(*) FROM public.exercises WHERE course_id = %s",
            (course_id,)
        )
        nbexercices = cur.fetchone()[0]

        # Mettre à jour la table courses
        cur.execute(
            """
            UPDATE public.courses
            SET nblessons = %s, nbexercices = %s
            WHERE id = %s
            """,
            (nblessons, nbexercices, course_id)
        )
        print(f"Mis à jour : {title} ({course_id}) - nblessons={nblessons}, nbexercices={nbexercices}")

    conn.commit()
    cur.close()
    conn.close()
    print("Mise à jour terminée.")

if __name__ == "__main__":
    update_course_stats()