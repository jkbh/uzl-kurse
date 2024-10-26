import logging
import sqlite3
import re

logger = logging.getLogger(__name__)


def insert_majors(majors, cur):
    logger.debug(f"inserting majors {majors}")
    matches = [re.search(r"\d{4}", name) for name in majors]
    years = [match.group() if match else None for match in matches]

    try:
        cur.executemany(
            """
            INSERT INTO major (name, year)
            VALUES (?,?)
            """,
            [row for row in zip(majors, years)],
        )
    except sqlite3.IntegrityError as e:
        logger.warning(e)


def insert_courses(courses, cur):
    for course in courses:
        logger.debug(f"inserting course {course.name}")
        try:
            cur.execute(
                """
                INSERT INTO course (url, number, name, duration, turnus, points)
                VALUES
                (?,?,?,?,?,?)""",
                [
                    course.url,
                    course.id,
                    course.name,
                    course.duration,
                    course.turnus,
                    course.points,
                ],
            )
        except sqlite3.IntegrityError as e:
            logger.warning(e)


def insert_major_has_course(courses, cur):
    for course in courses:
        (course_id,) = cur.execute(
            "SELECT id FROM course WHERE name=?", [course.name]
        ).fetchone()
        for study in course.studies:
            (major_id,) = cur.execute(
                "SELECT id FROM major WHERE name=?", [study.major]
            ).fetchone()
            cur.execute(
                "INSERT INTO major_has_course (major_id, course_id, category, area, semester) VALUES (?,?,?,?,?)",
                [major_id, course_id, study.category, study.area, study.semester],
            )


def insert_all(courses):
    conn = sqlite3.connect("test.db")
    cur = conn.cursor()

    majors = set([s.major for c in courses for s in c.studies])
    insert_majors(majors, cur)
    insert_courses(courses, cur)
    conn.commit()

    insert_major_has_course(courses, cur)
    conn.commit()
