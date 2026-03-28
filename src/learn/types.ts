/**
 * Data model for the Learn view — structured study content per phase.
 *
 * These types define the schema all phase content files must satisfy.
 * See docs/LEARN_CONTENT_SCHEMA.md for the annotated reference with examples.
 */

// ─── Tag labels ───────────────────────────────────────────────────────────────
export type TopicTag = 'Essential' | 'AI Trust ★' | 'Production' | 'Project';

// ─── A single expandable bullet point inside a topic ─────────────────────────
export interface LearnPoint {
  /** Short label — a term, function name, or concept. Shown in collapsed state. */
  label: string;
  /** 1–2 sentence explanation shown when expanded. Plain text, no markdown. */
  detail: string;
}

// ─── A topic card inside a section ───────────────────────────────────────────
export interface LearnTopic {
  title: string;
  tag: TopicTag;
  /** Hex colour from the C palette. */
  tagColor: string;
  /** One sentence summary of what this topic covers. */
  summary: string;
  /** 3–8 bullet points. */
  points: LearnPoint[];
  /** Optional runnable code block (template literal string). */
  code?: string;
}

// ─── A collapsible section inside a step ─────────────────────────────────────
export interface LearnSection {
  /** Unique within the step, e.g. "s01a", "s02b" */
  id: string;
  title: string;
  /** Hex colour for the section header accent. */
  color: string;
  /** Single unicode icon: ◈ ◇ ⬡ △ ○ */
  icon: string;
  /** 1–2 sentences framing the section's purpose. */
  intro: string;
  /** 2–4 topics. */
  topics: LearnTopic[];
}

// ─── A connection to another step, shown in the step sidebar ─────────────────
export interface LearnConnection {
  /** Short arrow reference e.g. "→ 08", "← 03", "→ MP-B" */
  label: string;
  /** One phrase explaining the connection. */
  desc: string;
}

// ─── A full learning step ─────────────────────────────────────────────────────
export interface LearnStep {
  /** Zero-padded string, e.g. "01", "14" — matches ALL_STEPS id. */
  id: string;
  title: string;
  /** e.g. "2–3 weeks" */
  duration: string;
  /** One-sentence tagline. */
  tagline: string;
  /** Accent colour for this step (hex from C palette). */
  color: string;
  /**
   * 3–5 sentences explaining WHY this step matters for an AI Trust practitioner,
   * connected to CDDBS / MP-B / MP-C / EU AI Act / CII / fairness/interpretability.
   */
  why: string;
  /** 3–5 connections to other steps or project components. */
  connections: LearnConnection[];
  /** 2–3 sections. */
  sections: LearnSection[];
}

// ─── A complete learning phase ────────────────────────────────────────────────
export interface LearnPhase {
  /** Kebab-case ID, e.g. "foundation", "classical-ml" */
  id: string;
  /** Display title, e.g. "Foundation" */
  title: string;
  /** Step range string, e.g. "01–07" */
  stepRange: string;
  /** Total estimated duration, e.g. "14–22 weeks" */
  duration: string;
  /** 2–3 sentence overview of the phase. */
  overview: string;
  /** Hex colour representing this phase in the phase nav. */
  color: string;
  steps: LearnStep[];
}
