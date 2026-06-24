// Word Search generator + Bible trivia + in-person couples games.

import { getDailyVerse } from "./daily-content";

const STOPWORDS = new Set([
  "the","and","for","with","that","this","from","into","unto","your","you",
  "she","her","his","him","they","their","them","but","not","are","was","were",
  "have","has","had","will","shall","can","may","let","all","one","two","its",
  "thy","thee","thou","who","what","when","whom","of","in","to","be","is","a",
  "an","on","at","by","as","or","if","so","my","me","do","did","done","go",
  "us","we","i","it","off","up","down","out","over","than","then","also","yet",
  "lord","god","jesus","christ","because","upon","unto","therefore",
]);

export function extractKeywords(text: string, max = 8): string[] {
  const words = text
    .replace(/[^A-Za-z\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim().toUpperCase())
    .filter((w) => w.length >= 4 && w.length <= 9 && !STOPWORDS.has(w.toLowerCase()));
  return Array.from(new Set(words)).slice(0, max);
}

export type WordSearch = {
  grid: string[][];
  words: string[];
  placements: { word: string; r: number; c: number; dr: number; dc: number }[];
};

// Simple word search: 12x12, horizontal/vertical/diagonal placements.
export function generateWordSearch(words: string[], size = 12): WordSearch {
  const grid: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const placements: WordSearch["placements"] = [];
  const dirs = [
    [0, 1], [1, 0], [1, 1], [-1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1],
  ];

  for (const raw of words) {
    const word = raw.toUpperCase();
    let placed = false;
    for (let tries = 0; tries < 200 && !placed; tries++) {
      const [dr, dc] = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      const endR = r + dr * (word.length - 1);
      const endC = c + dc * (word.length - 1);
      if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const ch = grid[r + dr * i][c + dc * i];
        if (ch !== "" && ch !== word[i]) { ok = false; break; }
      }
      if (!ok) continue;
      for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i];
      placements.push({ word, r, c, dr, dc });
      placed = true;
    }
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (grid[r][c] === "") grid[r][c] = letters[Math.floor(Math.random() * 26)];
  return { grid, words: placements.map((p) => p.word), placements };
}

export function getDailyWordSearch(): WordSearch {
  const verse = getDailyVerse();
  const words = extractKeywords(verse.text, 8);
  return generateWordSearch(words);
}

// --- Bible Trivia ---
export type TriviaQ = {
  question: string;
  options: string[];
  answer: number; // index
  scripture?: string;
};

export const TRIVIA: TriviaQ[] = [
  { question: "Who was the first woman God created?", options: ["Sarah","Eve","Mary","Rachel"], answer: 1, scripture: "Genesis 2:22" },
  { question: "What was Jesus' first miracle?", options: ["Healing a leper","Water into wine","Feeding 5,000","Walking on water"], answer: 1, scripture: "John 2:1-11" },
  { question: "Who said, 'Whither thou goest, I will go'?", options: ["Ruth","Naomi","Esther","Hannah"], answer: 0, scripture: "Ruth 1:16" },
  { question: "Proverbs 31 says the virtuous woman is worth more than what?", options: ["Gold","Silver","Rubies","Pearls"], answer: 2, scripture: "Prov 31:10" },
  { question: "What flowed out of Jesus when the woman touched His garment?", options: ["Light","Virtue","Water","Oil"], answer: 1, scripture: "Mark 5:30 KJV" },
  { question: "Who was known as the mother of all living?", options: ["Eve","Sarah","Mary","Hagar"], answer: 0, scripture: "Genesis 3:20" },
  { question: "Which queen risked her life saying, 'If I perish, I perish'?", options: ["Vashti","Esther","Bathsheba","Athaliah"], answer: 1, scripture: "Esther 4:16" },
  { question: "Mary's response to Gabriel began with what attitude?", options: ["Fear","Doubt","Worship","Servanthood"], answer: 3, scripture: "Luke 1:38" },
  { question: "Hannah's prayer was answered with what son?", options: ["Samson","Samuel","Saul","Solomon"], answer: 1, scripture: "1 Samuel 1:20" },
  { question: "How many days did Esther fast before the king?", options: ["1","3","7","40"], answer: 1, scripture: "Esther 4:16" },
  { question: "Who anointed Jesus' feet with expensive perfume?", options: ["Mary of Bethany","Martha","Mary Magdalene","Joanna"], answer: 0, scripture: "John 12:3" },
  { question: "What does 'ezer kenegdo' mean (Genesis 2:18)?", options: ["Beautiful one","Suitable helper","Quiet keeper","Faithful one"], answer: 1, scripture: "Genesis 2:18" },
  { question: "The fruit of the Spirit begins with what?", options: ["Joy","Peace","Love","Patience"], answer: 2, scripture: "Galatians 5:22" },
  { question: "Jesus told women to weep for whom outside Jerusalem?", options: ["Themselves","Him","Their husbands","Their enemies"], answer: 0, scripture: "Luke 23:28" },
  { question: "Which woman judged Israel?", options: ["Deborah","Miriam","Huldah","Anna"], answer: 0, scripture: "Judges 4:4" },
];

// --- In-person couples & womanhood games ---
export type IRLGame = {
  slug: string;
  title: string;
  type: "couple" | "womanhood";
  time: string;
  supplies: string;
  goal: string;
  steps: string[];
};

export const IRL_GAMES: IRLGame[] = [
  {
    slug: "sock-challenge", title: "The Sock Challenge", type: "couple",
    time: "10 min", supplies: "One pair of socks",
    goal: "Laugh together — and remember you're on the same team.",
    steps: [
      "Each of you put both feet inside ONE sock (you'll be standing close).",
      "Set a 60-second timer.",
      "Without using hands, work together to swap which foot is in front.",
      "Each completed swap = 1 point. No hands allowed.",
      "When time's up, share one thing you appreciated about how the other communicated.",
    ],
  },
  {
    slug: "back-to-back", title: "Back-to-Back Q&A", type: "couple",
    time: "20 min", supplies: "Just the two of you",
    goal: "Listen without facing the urge to react.",
    steps: [
      "Sit back-to-back on the floor.",
      "Take turns answering: 'What's one thing on my heart you may not know?'",
      "The listener says nothing until the speaker is fully done.",
      "Reply with: 'What I heard you say is…'",
      "Switch. End by turning around, hugging, and praying together.",
    ],
  },
  {
    slug: "marriage-jenga", title: "Marriage Jenga", type: "couple",
    time: "30 min", supplies: "Jenga set + marker",
    goal: "Build conversation in the rhythm of play.",
    steps: [
      "Label every Jenga block with a question (love language, favorite memory, dream, prayer request, etc.).",
      "Stack and play as usual.",
      "Whoever pulls a block must answer the question on it.",
      "If the tower falls, the one who toppled it speaks a blessing.",
      "Pray together at the end.",
    ],
  },
  {
    slug: "love-letter-night", title: "Love Letter Night", type: "couple",
    time: "30 min", supplies: "Paper, pens, candle",
    goal: "Speak what's usually unspoken.",
    steps: [
      "Light a candle. Phones away.",
      "Each write a letter answering: 'What I see in you right now.'",
      "Trade letters. Read silently.",
      "Take 5 minutes to respond out loud.",
      "Pray Eph 3:17-19 over each other.",
    ],
  },
  {
    slug: "dream-walk", title: "Dream Walk", type: "couple",
    time: "30 min", supplies: "Walking shoes",
    goal: "Move and dream together.",
    steps: [
      "Walk together for 20 min.",
      "First 10 min: name 5 dreams each (no critique).",
      "Next 10 min: pick one to take a small step toward this month.",
      "End by praying over that step.",
    ],
  },
  {
    slug: "scripture-relay", title: "Scripture Relay", type: "couple",
    time: "15 min", supplies: "Two Bibles",
    goal: "Hide His Word in your hearts — together.",
    steps: [
      "Pick a passage (e.g., Psalm 23).",
      "Take turns reciting verse-by-verse from memory.",
      "When one stumbles, the other prays for them.",
      "Finish by praying the passage over your home.",
    ],
  },
  {
    slug: "highs-lows", title: "Highs, Lows & Holies", type: "couple",
    time: "10 min", supplies: "Just you",
    goal: "Daily emotional check-in.",
    steps: [
      "Each share your high of the day.",
      "Each share your low.",
      "Each share where you saw God (the 'holy').",
      "Pray a short blessing over each other.",
    ],
  },
  {
    slug: "gratitude-game", title: "30-Second Gratitude Volley", type: "womanhood",
    time: "5 min", supplies: "A friend or kids",
    goal: "Train the heart to give thanks.",
    steps: [
      "Set a 30-second timer.",
      "Volley back and forth: one thing you're grateful for, no repeats.",
      "Whoever runs out first must pray a thank-you prayer aloud.",
    ],
  },
];

export function getGame(slug: string) {
  return IRL_GAMES.find((g) => g.slug === slug);
}
