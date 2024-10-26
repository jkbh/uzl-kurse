CREATE TABLE IF NOT EXISTS course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT UNIQUE NOT NULL,
  number TEXT UNIQUE NOT NULL,
  name TEXT UNIQUE NOT NULL,
  duration INTEGER NOT NULL,
  turnus TEXT NOT NULL,
  points INT NOT NULL
);


CREATE TABLE IF NOT EXISTS course_has_subcourses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  subcourse_id INTEGER,
  FOREIGN KEY (course_id) REFERENCES module (id),
  FOREIGN KEY (subcourse_id) REFERENCES module (id)
);


CREATE TABLE IF NOT EXISTS major (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  year INTEGER
);


CREATE TABLE IF NOT EXISTS major_has_course (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  major_id INTEGER,
  course_id INTEGER,
  category TEXT,
  area TEXT,
  semester TEXT,
  FOREIGN KEY (major_id) REFERENCES major (id),
  FOREIGN KEY (course_id) REFERENCES course (id)
)