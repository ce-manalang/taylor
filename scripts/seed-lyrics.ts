/**
 * Seed lyrics script - generates embeddings for curated Taylor Swift lyrics
 *
 * Model: text-embedding-3-small (locked)
 * - 5x cheaper than ada-002
 * - Better accuracy
 * - 1536 dimensions (normalized by OpenAI)
 *
 * Run: OPENAI_API_KEY=sk-... npx tsx scripts/seed-lyrics.ts
 * Output: scripts/seed-lyrics.sql
 */

import OpenAI from 'openai';
import fs from 'fs';

// Curated Taylor Swift lyrics (~30 lyrics, diverse emotional range)
// Guidelines: 1-2 lines max, punchy single-thought, all bangers
const lyrics = [
  // Resilience & Survival
  "Long story short, I survived",
  "This is me trying",
  "I'm doing good, I'm on some new shit",
  "I've been the archer, I've been the prey",

  // Self-awareness & Growth
  "It's me, hi, I'm the problem, it's me",
  "I'm the only one of me, baby, that's the fun of me",
  "I've made really deep cuts",
  "I had the time of my life fighting dragons with you",

  // Heartbreak & Loss
  "Band-aids don't fix bullet holes",
  "You call me up again just to break me like a promise",
  "All too well, and I was there",
  "The worst thing that I ever did was what I did to you",
  "How you held me in your arms that September night, the first time you ever saw me cry",

  // Empowerment & Closure
  "We are never ever getting back together",
  "I knew you were trouble when you walked in",
  "I don't trust nobody and nobody trusts me",
  "Look what you made me do",

  // Letting Go
  "Shake it off",
  "You need to calm down",
  "It's nice to have a friend",

  // Love & Vulnerability
  "You are the best thing that's ever been mine",
  "I want to wear his initial on a chain round my neck",
  "Can I go where you go? Can we always be this close?",
  "I could build a castle out of all the bricks they threw at me",

  // Independence & Boundaries
  "I'm shining like fireworks over your sad empty town",
  "I'm walking on sunshine",
  "Who's afraid of little old me? You should be",

  // Nostalgia & Reflection
  "We were both young when I first saw you",
  "Back when we were still changing for the better",
  "Time won't fly, it's like I'm paralyzed by it"
];

async function main() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('ERROR: OPENAI_API_KEY environment variable not set');
    console.error('Usage: OPENAI_API_KEY=sk-... npx tsx scripts/seed-lyrics.ts');
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey });

  console.log(`Generating embeddings for ${lyrics.length} lyrics...`);
  console.log(`Model: text-embedding-3-small (1536 dimensions)`);

  // Batch embed all lyrics in single API call
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: lyrics
  });

  console.log(`Received ${response.data.length} embeddings`);

  // Generate SQL INSERT statements
  let sql = '-- Seed data: Taylor Swift lyrics with embeddings\n';
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Model: text-embedding-3-small\n`;
  sql += `-- Count: ${lyrics.length} lyrics\n\n`;
  sql += 'INSERT INTO lyrics (lyric_text, embedding) VALUES\n';

  lyrics.forEach((lyric, i) => {
    const vector = `[${response.data[i].embedding.join(',')}]`;
    const escaped = lyric.replace(/'/g, "''");
    sql += `  ('${escaped}', '${vector}')`;
    sql += i < lyrics.length - 1 ? ',\n' : ';\n';
  });

  const outputPath = 'scripts/seed-lyrics.sql';
  fs.writeFileSync(outputPath, sql);

  console.log(`\nSuccess! Generated ${outputPath} with ${lyrics.length} lyrics`);
  console.log(`\nNext steps:`);
  console.log(`1. Run scripts/setup-supabase.sql in Supabase SQL Editor`);
  console.log(`2. Run ${outputPath} in Supabase SQL Editor`);
  console.log(`3. Verify: SELECT count(*) FROM lyrics WHERE embedding IS NOT NULL;`);
}

main().catch(console.error);
