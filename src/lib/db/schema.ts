/**
 * Table creation SQL for Database Version 1.
 * Mirrors DATABASE_SCHEMA.md exactly. Do not edit existing table
 * definitions once shipped — add a migration in migrations.ts instead
 * (DATABASE_SCHEMA.md §17).
 *
 * Cascade rules implement DATABASE_SCHEMA.md §15 at the SQLite level:
 * deleting a Fiction cascades to Draft/Note/Favorite/RecentProject,
 * and deleting a Draft cascades to Chapter/ReadingState.
 */
export const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS fiction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  synopsis TEXT,
  description TEXT,
  coverPath TEXT,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_fiction_title ON fiction(title);
CREATE INDEX IF NOT EXISTS idx_fiction_updatedAt ON fiction(updatedAt);

CREATE TABLE IF NOT EXISTS draft (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fictionId INTEGER NOT NULL REFERENCES fiction(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_draft_fictionId ON draft(fictionId);
CREATE INDEX IF NOT EXISTS idx_draft_updatedAt ON draft(updatedAt);

CREATE TABLE IF NOT EXISTS chapter (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  draftId INTEGER NOT NULL REFERENCES draft(id) ON DELETE CASCADE,
  chapterNumber INTEGER NOT NULL,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  wordCount INTEGER NOT NULL DEFAULT 0,
  characterCount INTEGER NOT NULL DEFAULT 0,
  readingTimeMinutes INTEGER NOT NULL DEFAULT 0,
  readingPosition INTEGER NOT NULL DEFAULT 0,
  ttsPosition INTEGER NOT NULL DEFAULT 0,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_chapter_draftId ON chapter(draftId);
CREATE INDEX IF NOT EXISTS idx_chapter_chapterNumber ON chapter(chapterNumber);
CREATE INDEX IF NOT EXISTS idx_chapter_updatedAt ON chapter(updatedAt);

CREATE TABLE IF NOT EXISTS note (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fictionId INTEGER NOT NULL REFERENCES fiction(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT NOT NULL DEFAULT '',
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_note_fictionId ON note(fictionId);

CREATE TABLE IF NOT EXISTS tag (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS fictionTag (
  fictionId INTEGER NOT NULL REFERENCES fiction(id) ON DELETE CASCADE,
  tagId INTEGER NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
  PRIMARY KEY (fictionId, tagId)
);

CREATE TABLE IF NOT EXISTS readingState (
  draftId INTEGER PRIMARY KEY REFERENCES draft(id) ON DELETE CASCADE,
  chapterId INTEGER REFERENCES chapter(id) ON DELETE SET NULL,
  scrollPosition INTEGER NOT NULL DEFAULT 0,
  ttsPosition INTEGER NOT NULL DEFAULT 0,
  updatedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS favorite (
  fictionId INTEGER PRIMARY KEY REFERENCES fiction(id) ON DELETE CASCADE,
  pinnedAt INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS recentProject (
  fictionId INTEGER PRIMARY KEY REFERENCES fiction(id) ON DELETE CASCADE,
  lastOpened INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  theme TEXT NOT NULL DEFAULT 'system',
  fontSize INTEGER NOT NULL DEFAULT 16,
  lineSpacing REAL NOT NULL DEFAULT 1.5,
  readerTheme TEXT NOT NULL DEFAULT 'light',
  ttsRate REAL NOT NULL DEFAULT 1.0,
  ttsPitch REAL NOT NULL DEFAULT 1.0,
  ttsVoice TEXT,
  keepScreenAwake INTEGER NOT NULL DEFAULT 0,
  autosave INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS appMetadata (
  databaseVersion INTEGER NOT NULL,
  createdAt INTEGER NOT NULL,
  updatedAt INTEGER NOT NULL
);
`;
