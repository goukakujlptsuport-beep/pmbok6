import { sqliteTable, text, integer, real, uniqueIndex, index } from 'drizzle-orm/sqlite-core'

export const highlights = sqliteTable('highlights', {
  id:        text('id').primaryKey(),
  book:      text('book').notNull(),
  chap:      text('chap').notNull(),
  color:     text('color').notNull(),
  note:      text('note'),
  hlText:    text('text'),
  sxp:       text('sxp').notNull(),
  so:        integer('so').notNull(),
  exp:       text('exp').notNull(),
  eo:        integer('eo').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
}, (t) => ({
  posUniq: uniqueIndex('hl_pos_uniq').on(t.book, t.chap, t.sxp, t.so, t.exp, t.eo),
}))

export const kvStore = sqliteTable('kv_store', {
  key:       text('key').primaryKey(),
  value:     text('value').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export const readingProgress = sqliteTable('reading_progress', {
  book:      text('book').notNull(),
  chap:      text('chap').notNull(),
  status:    text('status').notNull().default('not_started'),
  scrollPct: real('scroll_pct').default(0),
  timeSpent: integer('time_spent').default(0),
  lastRead:  integer('last_read'),
}, (t) => ({
  pk: uniqueIndex('rp_pk').on(t.book, t.chap),
}))

export const studyLog = sqliteTable('study_log', {
  id:        text('id').primaryKey(),
  type:      text('type').notNull(),
  book:      text('book'),
  chap:      text('chap'),
  durationS: integer('duration_s').notNull(),
  localDate: text('local_date').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const questions = sqliteTable('questions', {
  id:         text('id').primaryKey(),
  source:     text('source').notNull(),
  chap:       text('chap'),
  type:       text('type').notNull(),
  question:   text('question').notNull(),
  options:    text('options'),
  answer:     text('answer').notNull(),
  explainVi:  text('explain_vi'),
  explainEn:  text('explain_en'),
  difficulty: integer('difficulty').default(3),
  tags:       text('tags'),
  createdAt:  integer('created_at').notNull(),
})

export const quizSessions = sqliteTable('quiz_sessions', {
  id:         text('id').primaryKey(),
  mode:       text('mode').notNull(),
  source:     text('source'),
  chap:       text('chap'),
  total:      integer('total').notNull(),
  correct:    integer('correct').notNull(),
  durationS:  integer('duration_s'),
  startedAt:  integer('started_at').notNull(),
  finishedAt: integer('finished_at'),
})

export const questionStats = sqliteTable('question_stats', {
  id:         text('id').primaryKey(),
  questionId: text('question_id').notNull(),
  sessionId:  text('session_id').notNull(),
  answeredAt: integer('answered_at').notNull(),
  correct:    integer('correct').notNull(),
  timeMs:     integer('time_ms'),
}, (t) => ({
  qIdx: index('idx_qstats_question').on(t.questionId),
  sIdx: index('idx_qstats_session').on(t.sessionId),
}))

export const srsCards = sqliteTable('srs_cards', {
  itemId:      text('item_id').primaryKey(),
  itemType:    text('item_type').notNull(),
  ease:        real('ease').default(2.5),
  interval:    integer('interval').default(1),
  repetitions: integer('repetitions').default(0),
  nextReview:  integer('next_review').notNull(),
  lastScore:   integer('last_score'),
  updatedAt:   integer('updated_at').notNull(),
})

export const vocabTerms = sqliteTable('vocab_terms', {
  id:         text('id').primaryKey(),
  en:         text('en').notNull(),
  vi:         text('vi').notNull(),
  descVi:     text('desc_vi'),
  descEn:     text('desc_en'),
  exampleVi:  text('example_vi'),
  exampleEn:  text('example_en'),
  category:   text('category'),
  difficulty: integer('difficulty').default(3),
})
