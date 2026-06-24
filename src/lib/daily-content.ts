// Daily seed content. Shared spiritual rhythm — rotates by day-of-year.

export type Verse = {
  reference: string;
  text: string;
  insight: string;
};

export const VERSES: Verse[] = [
  {
    reference: "Proverbs 31:25",
    text: "She is clothed with strength and dignity; she can laugh at the days to come.",
    insight: "Today, let strength and dignity be the fabric you wear — not as performance, but as identity in Christ.",
  },
  {
    reference: "Psalm 46:5",
    text: "God is within her, she will not fall; God will help her at break of day.",
    insight: "His presence is closer than your next breath. Let this verse anchor you before the day demands anything of you.",
  },
  {
    reference: "Ephesians 4:2",
    text: "Be completely humble and gentle; be patient, bearing with one another in love.",
    insight: "Relationships are the workshop where humility is forged. Practice gentleness in the small moments today.",
  },
  {
    reference: "1 Peter 3:3-4",
    text: "Your beauty should not come from outward adornment… Rather, it should be that of your inner self, the unfading beauty of a gentle and quiet spirit.",
    insight: "True beauty is cultivated in secret, in the unseen places of communion with God.",
  },
  {
    reference: "Proverbs 14:1",
    text: "The wise woman builds her house, but with her own hands the foolish one tears hers down.",
    insight: "Your words, your countenance, your prayers — these are the bricks you build with today.",
  },
  {
    reference: "Isaiah 26:3",
    text: "You will keep in perfect peace those whose minds are steadfast, because they trust in you.",
    insight: "Steady your mind on Him before you steady anything else.",
  },
  {
    reference: "Colossians 3:14",
    text: "And over all these virtues put on love, which binds them all together in perfect unity.",
    insight: "Love is not the last accessory — it is the thread that holds everything together.",
  },
];

export const FUN_FACTS = [
  { text: "The word 'helper' used for Eve (ezer) is also used 16 times in the Old Testament to describe God Himself.", verse: "Genesis 2:18" },
  { text: "The Hebrew word for 'virtuous' in Proverbs 31 (chayil) is the same word used for valiant warriors.", verse: "Proverbs 31:10" },
  { text: "Jesus' first miracle was at a wedding — God delights in covenant.", verse: "John 2:1-11" },
  { text: "The Bible begins with a wedding (Adam and Eve) and ends with a wedding (the Lamb and His Bride).", verse: "Revelation 19:7" },
];

function dayIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export function getDailyVerse(): Verse {
  return VERSES[dayIndex() % VERSES.length];
}
export function getDailyFunFact() {
  return FUN_FACTS[dayIndex() % FUN_FACTS.length];
}

// V.I.R.T.U.E. — renamed from "pillars" to "shifts"
export const SHIFTS = [
  {
    key: "V",
    name: "Vision",
    tagline: "God's vision for your life, marriage, and legacy.",
    description: "See your life through Heaven's eyes — and walk it out with clarity.",
    accent: "rose" as const,
  },
  {
    key: "I",
    name: "Intentional Intimacy",
    tagline: "Closeness with God, self, and the people you love.",
    description: "Daily Revival Verse, SOAP, Dares, Prayer Journal.",
    accent: "gold" as const,
  },
  {
    key: "R",
    name: "Repent, Renounce & Release",
    tagline: "Healing, freedom, and surrender.",
    description: "Forgiveness Journal, Release Exercises, Heart Check.",
    accent: "sage" as const,
  },
  {
    key: "T",
    name: "Truth Over Emotion",
    tagline: "Renew your mind. Take thoughts captive.",
    description: "Event → Thought → Emotion → Story → Truth → Replace the Lie.",
    accent: "rose" as const,
  },
  {
    key: "U",
    name: "Uplift & Serve",
    tagline: "Love in action — at home, church, and community.",
    description: "Service, respect, gratitude, kindness, hospitality.",
    accent: "gold" as const,
  },
  {
    key: "E",
    name: "Empowered & Equipped",
    tagline: "From growth to mentorship.",
    description: "Prayer Warrior Center, Titus 2 Community, Testimony Journal.",
    accent: "sage" as const,
  },
] as const;

export type ShiftKey = typeof SHIFTS[number]["key"];
