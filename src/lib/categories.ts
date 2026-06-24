// 12 categories matching the user's reference screenshot.
// Each carries 20 subcategory topics, each linked to one of the 6 SHIFTS.

import type { ShiftKey } from "./daily-content";

export type Topic = {
  slug: string;
  title: string;
  shift: ShiftKey;
  kind: "lesson" | "quiz" | "challenge" | "game" | "journal";
  scripture: string;
  summary: string;
  steps: string[];
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  icon: string;        // lucide icon name
  tint: string;        // tailwind bg-* class
  iconColor: string;   // tailwind text-* class
  marriedOnly?: boolean;
  topics: Topic[];
};

// --- helper for compact authoring ---
const t = (
  slug: string, title: string, shift: ShiftKey, kind: Topic["kind"],
  scripture: string, summary: string, steps: string[],
): Topic => ({ slug, title, shift, kind, scripture, summary, steps });

export const CATEGORIES: Category[] = [
  {
    slug: "wifehood", name: "Wifehood",
    blurb: "Becoming the wife the Word calls you to be.",
    icon: "Heart", tint: "bg-rose/15", iconColor: "text-rose",
    marriedOnly: true,
    topics: [
      t("identity-in-christ", "Wifehood Identity", "V", "lesson", "1 Peter 3:1-6", "Your identity as a wife flows from being a daughter first.", ["Read 1 Peter 3:1-6 slowly.", "Underline what wifehood is rooted in.", "Pray: 'Father, root me in You before any role.'"]),
      t("submission-redefined", "Submission Redefined", "T", "lesson", "Ephesians 5:21-22", "Mutual reverence — not silence.", ["Read Eph 5:21 first, then 22.", "Journal what submission means in your marriage.", "Ask the Spirit to renew your understanding."]),
      t("respect-language", "His Respect Language", "I", "challenge", "Eph 5:33", "Learn the specific way your husband feels respected.", ["Ask him: 'What makes you feel respected by me?'", "Listen without defending.", "Practice one thing today."]),
      t("crown-or-decay", "Crown or Decay", "T", "quiz", "Proverbs 12:4", "An excellent wife is her husband's crown.", ["Take the heart-check.", "Identify one decay pattern.", "Ask God to restore."]),
      t("becoming-his-helper", "His Helper (Ezer)", "V", "lesson", "Genesis 2:18", "Ezer = warrior-strong help, like God Himself.", ["Read Genesis 2:18.", "List 3 ways to help his calling this week.", "Choose one to start today."]),
      t("guard-your-tongue", "Guard Your Tongue", "T", "challenge", "Proverbs 21:9", "A peaceful home begins on your lips.", ["No complaint about him for 24 hours.", "Replace each complaint with a prayer.", "Journal what shifts."]),
      t("praying-wife", "The Praying Wife", "I", "journal", "James 5:16", "Your prayers carry weight in his life.", ["Pick 7 areas to pray over him.", "Pray one per day this week.", "Note answers."]),
      t("wife-of-noble-character", "Wife of Noble Character", "V", "lesson", "Proverbs 31:10-31", "Proverbs 31 is poetry, not pressure.", ["Read all 22 verses.", "Pick one verse for this season.", "Live that one verse this week."]),
      t("from-nagging-to-blessing", "From Nagging to Blessing", "R", "challenge", "Proverbs 27:15", "Release nagging. Choose blessing.", ["Notice every nag-thought today.", "Convert it to a prayer or blessing.", "Speak the blessing aloud."]),
      t("honoring-his-mother", "Honoring His Family", "U", "lesson", "Exodus 20:12", "Honor opens blessing.", ["Write what you appreciate about his family.", "Send one a kind word this week.", "Pray for them daily."]),
      t("financial-trust", "Financial Trust", "T", "lesson", "Proverbs 31:11", "He trusts in her — including with finances.", ["Talk about money this week without blame.", "Agree on one shared goal.", "Pray over your finances together."]),
      t("hospitality-of-the-heart", "Hospitality of the Heart", "U", "challenge", "Romans 12:13", "Make your home a sanctuary.", ["Light a candle.", "Welcome him home with eye contact.", "Make space, not noise."]),
      t("forgiveness-flow", "Forgiveness Flow", "R", "journal", "Eph 4:32", "Forgiveness is daily oxygen.", ["List one offense to release today.", "Pray Eph 4:32 over him.", "Burn or shred the list."]),
      t("modesty-and-beauty", "Inner Beauty", "I", "lesson", "1 Peter 3:3-4", "Unfading beauty over fashion trends.", ["Read 1 Peter 3:3-4.", "Identify one heart-beauty practice.", "Begin this morning."]),
      t("apologizing-well", "How to Apologize Well", "R", "lesson", "James 5:16", "Confession heals.", ["Use the 4 R's: regret, responsibility, restitution, repentance.", "Apologize for one thing today.", "Don't add 'but'."]),
      t("speaking-life", "Speaking Life", "U", "challenge", "Proverbs 18:21", "Your tongue carries life or death.", ["Speak 3 life-words to him today.", "Avoid sarcasm.", "Notice his face."]),
      t("vision-as-a-wife", "Your Vision as a Wife", "V", "lesson", "Hab 2:2", "Write the vision down.", ["Define what you want your marriage to feel like in 5 years.", "Write 3 sentences.", "Pray over it."]),
      t("warfare-prayer", "Warfare for Your Marriage", "E", "journal", "Eph 6:12", "Your battle isn't him.", ["Identify spiritual attacks on your marriage.", "Pray Eph 6 armor over both of you.", "Stand."]),
      t("titus-two", "Titus 2 Mentorship", "E", "lesson", "Titus 2:3-5", "Be discipled, then disciple.", ["Identify 1 older woman to learn from.", "Ask her for coffee.", "Begin a conversation."]),
      t("daily-rhythm", "Your Daily Rhythm", "I", "challenge", "Lam 3:22-23", "Build a sacred daily rhythm.", ["Choose a morning anchor.", "Choose a midday pause.", "Choose an evening close."]),
    ],
  },
  {
    slug: "marriage", name: "Marriage",
    blurb: "Covenant. Communication. Connection.",
    icon: "Heart", tint: "bg-rose/25", iconColor: "text-rose",
    marriedOnly: true,
    topics: gen20("marriage", "I"),
  },
  {
    slug: "motherhood", name: "Motherhood",
    blurb: "Train up a child in the way she should go.",
    icon: "Baby", tint: "bg-[#ede4ff]", iconColor: "text-[#7b5edc]",
    topics: gen20("motherhood", "V"),
  },
  {
    slug: "womanhood", name: "Womanhood",
    blurb: "Beauty, identity, and worth in Him.",
    icon: "Sparkles", tint: "bg-[#fbe7c2]", iconColor: "text-[#d18a2a]",
    topics: gen20("womanhood", "V"),
  },
  {
    slug: "home-management", name: "Home Management",
    blurb: "A peaceful home is built, not stumbled into.",
    icon: "Home", tint: "bg-[#d6f3df]", iconColor: "text-[#1f7f4a]",
    topics: [
      t("declutter-bedroom", "Declutter the Bedroom", "U", "challenge", "1 Cor 14:33", "Order invites peace.", ["Set 20 min timer.", "Sort: keep / give / toss.", "Make the bed."]),
      t("declutter-kitchen", "Declutter the Kitchen", "U", "challenge", "1 Cor 14:33", "Order in the heart of the home.", ["Clear counters fully.", "Donate 5 unused items.", "Wipe and wash."]),
      t("declutter-closet", "Declutter the Closet", "R", "challenge", "Ecc 3:6", "There's a time to release.", ["Pull every item.", "Keep only what you love + use.", "Bag the rest."]),
      t("meal-planning", "Weekly Meal Planning", "U", "lesson", "Prov 31:15", "Provision begins with planning.", ["Plan 5 dinners.", "Make one grocery list.", "Prep proteins on day one."]),
      t("meal-prep-sunday", "Sunday Meal Prep", "U", "challenge", "Prov 31:15", "An hour now saves the week.", ["Chop 3 vegetables.", "Cook 1 grain.", "Portion lunches."]),
      t("morning-routine", "Build a Morning Routine", "I", "lesson", "Lam 3:22-23", "Morning sets the day's tone.", ["Make bed.", "Word + water.", "One small win before phone."]),
      t("evening-routine", "Build an Evening Routine", "I", "lesson", "Psalm 4:8", "End the day with peace.", ["Tidy 10 min.", "Prep for tomorrow.", "Read, pray, sleep."]),
      t("budget-basics", "Family Budget Basics", "T", "lesson", "Luke 14:28", "Count the cost.", ["List all income.", "List all bills.", "Name one savings goal."]),
      t("home-rhythms", "Weekly Home Rhythms", "U", "lesson", "Ecc 3:1", "A time for everything.", ["Pick a wash day.", "Pick a kitchen-deep day.", "Pick a rest day."]),
      t("laundry-system", "A Laundry System That Works", "U", "challenge", "1 Cor 14:40", "Order everything decently.", ["One load per day.", "Fold before bed.", "Put away immediately."]),
      t("kids-chore-chart", "Kids' Chore Chart", "U", "lesson", "Prov 22:6", "Train little hands to serve.", ["List age-appropriate tasks.", "Make a visible chart.", "Praise effort."]),
      t("hospitality-prep", "Hosting With Grace", "U", "lesson", "Rom 12:13", "Welcome is worship.", ["Plan a simple menu.", "Pre-clean one room.", "Pray over guests."]),
      t("paper-clutter", "Conquer Paper Clutter", "R", "challenge", "Ecc 3:6", "Release what you don't need.", ["One drawer / 15 min.", "Shred or scan.", "Designate an inbox."]),
      t("digital-declutter", "Digital Declutter", "R", "challenge", "Psalm 101:3", "Guard what you behold.", ["Delete 30 apps.", "Unsubscribe from 10 emails.", "Mute 5 notifications."]),
      t("seasonal-deep-clean", "Seasonal Deep Clean", "U", "challenge", "Isa 1:18", "Renewal in the rhythm.", ["Pick one season-room.", "Top to bottom.", "Light a candle when done."]),
      t("grocery-saving", "Grocery Saving Plays", "T", "lesson", "Prov 21:20", "The wise store up.", ["Shop with a list.", "Buy proteins on sale.", "Use what you have first."]),
      t("freezer-meals", "Freezer Meal Day", "U", "challenge", "Prov 31:15", "Future-self generosity.", ["Cook 3 doubled dinners.", "Freeze in portions.", "Label and date."]),
      t("home-as-sanctuary", "Home as Sanctuary", "I", "lesson", "Ps 90:1", "Your home can preach peace.", ["Identify the loudest room.", "Soften it (candle, music).", "Pray a blessing over it."]),
      t("time-blocking", "Time-Block Your Day", "T", "lesson", "Eph 5:16", "Redeem the time.", ["Pick 3 blocks: holy / home / hustle.", "Defend the holy.", "Review tonight."]),
      t("printable-meal-plan", "Printable Meal Plan", "U", "lesson", "Prov 31:27", "What you measure, you manage.", ["Use the template.", "Plan Monday → Sunday.", "Post on the fridge."]),
    ],
  },
  {
    slug: "communication", name: "Communication",
    blurb: "Words that build, listen, and heal.",
    icon: "MessageCircle", tint: "bg-[#cfe7fb]", iconColor: "text-[#1f7eb8]",
    topics: gen20("communication", "T"),
  },
  {
    slug: "parenting", name: "Parenting",
    blurb: "Discipling little hearts with God's hand.",
    icon: "Baby", tint: "bg-[#ede4ff]", iconColor: "text-[#7b5edc]",
    topics: [
      ...gen20("parenting", "U").slice(0, 16),
      t("homeschool-blueprint", "Homeschool Blueprint", "V", "lesson", "Deut 6:6-7", "Teach diligently as you go.", ["Pick a curriculum framework.", "Build a daily rhythm.", "Add a faith anchor."]),
      t("public-school-faith", "Public School + Faith at Home", "V", "lesson", "Deut 6:6-7", "Disciple at home, even with public school.", ["Pray over the school day.", "Debrief one truth each evening.", "Memorize one verse a week as a family."]),
      t("christian-tv-shows", "Wholesome TV Suggestions", "I", "lesson", "Phil 4:8", "Feed their minds well.", ["Superbook (animated Bible).", "Bibleman, VeggieTales, David & Goliath movie.", "LifeKids TV / 3-2-1 Penguins."]),
      t("scripture-memory-kids", "Scripture Memory for Kids", "I", "challenge", "Ps 119:11", "Hide His Word in their hearts.", ["Pick one verse per week.", "Sing it.", "Reward recitation."]),
    ],
  },
  {
    slug: "intimacy", name: "Intimacy",
    blurb: "Sacred closeness — emotional, physical, spiritual.",
    icon: "Heart", tint: "bg-rose/20", iconColor: "text-rose",
    marriedOnly: true,
    topics: gen20("intimacy", "I"),
  },
  {
    slug: "conflict-resolution", name: "Conflict Resolution",
    blurb: "Fight for, not against, each other.",
    icon: "Handshake", tint: "bg-[#ffd9b8]", iconColor: "text-[#c8551a]",
    topics: gen20("conflict-resolution", "R"),
  },
  {
    slug: "community", name: "Community",
    blurb: "Titus 2 sisterhood — be discipled, then disciple.",
    icon: "Users", tint: "bg-[#c7f0e3]", iconColor: "text-[#1d8a78]",
    topics: gen20("community", "E"),
  },
  {
    slug: "stewardship", name: "Stewardship",
    blurb: "Money, time, body, and gifts under His lordship.",
    icon: "Wallet", tint: "bg-[#d6f3df]", iconColor: "text-[#1f7f4a]",
    topics: gen20("stewardship", "T"),
  },
  {
    slug: "biblical-living", name: "Biblical Living",
    blurb: "Doctrine that drips into daily life.",
    icon: "BookOpen", tint: "bg-[#dcd9ff]", iconColor: "text-[#5a4ed9]",
    topics: gen20("biblical-living", "I"),
  },
  {
    slug: "health", name: "Health",
    blurb: "Body, mind, and rest as worship.",
    icon: "Activity", tint: "bg-[#d8f0d8]", iconColor: "text-[#3a8a3a]",
    topics: gen20("health", "U"),
  },
];

// Bulk topic generator — gives every category 20 quality topics.
function gen20(cat: string, defaultShift: ShiftKey): Topic[] {
  const presets: Record<string, Array<[string, string, ShiftKey, Topic["kind"], string, string, string[]]>> = {
    marriage: [
      ["covenant-vs-contract", "Covenant vs Contract", "V", "lesson", "Mal 2:14", "Marriage is covenant, not a deal.", ["Define covenant in your own words.", "Pray for a covenant heart.", "Tell him your re-commitment."]],
      ["the-five-love-languages", "Discover Love Languages", "I", "quiz", "1 Cor 13", "Speak love in his dialect.", ["Take the 5LL quiz together.", "Share your top 2.", "Practice his for 7 days."]],
      ["weekly-check-in", "Weekly State-of-Us Check-In", "T", "challenge", "Prov 27:23", "Know the state of your flock.", ["Pick a recurring 30 min.", "Ask 3 set questions.", "Pray together."]],
      ["money-talks", "Money Without Fights", "T", "lesson", "Prov 22:7", "Money reveals values.", ["Schedule a money date.", "Share one fear, one dream.", "Agree on one step."]],
      ["sex-and-faith", "Sex as Worship", "I", "lesson", "Heb 13:4", "Marriage bed is honorable.", ["Talk about desires and limits.", "Pray together about intimacy.", "Plan one connection night."]],
      ["fight-fair", "How to Fight Fair", "R", "lesson", "Eph 4:26", "Don't let the sun set in anger.", ["No 'always/never'.", "One issue at a time.", "Reconcile before sleep."]],
      ["weekly-date-night", "Protect the Weekly Date", "U", "challenge", "Ecc 9:9", "Joy is fuel.", ["Pick a recurring night.", "Plan 4 dates ahead.", "Phones away."]],
      ["pray-the-armor", "Pray the Armor Over Marriage", "E", "journal", "Eph 6:10-18", "Stand against the real enemy.", ["Print Eph 6:10-18.", "Pray each piece by name.", "Pray it weekly."]],
      ["marriage-vision-board", "Marriage Vision Board", "V", "lesson", "Hab 2:2", "See it written.", ["List 7 vision statements.", "Find 1 image per statement.", "Hang it where you both see."]],
      ["in-laws-with-grace", "In-Laws With Grace", "U", "lesson", "Ex 20:12", "Honor opens blessing.", ["Speak one honoring thing.", "Plan a kindness.", "Pray for them."]],
      ["forgiveness-account", "Keep a Clean Account", "R", "challenge", "Eph 4:32", "Don't store offenses.", ["End each day at zero.", "Confess quickly.", "Forgive quickly."]],
      ["serve-his-purpose", "Serve His Purpose", "U", "lesson", "Phil 2:4", "Look to his interests.", ["Ask: 'How can I help your dream?'", "Take one action.", "Celebrate his wins."]],
      ["receive-his-leadership", "Receive His Leadership", "T", "lesson", "Eph 5:23", "Trust opens room to lead.", ["Yield one decision.", "Affirm his attempt.", "Don't critique tone."]],
      ["pray-together-7-days", "Pray Together 7 Days", "I", "challenge", "Matt 18:20", "Two agreeing in prayer.", ["1 minute together.", "Same time daily.", "Track what shifts."]],
      ["weekly-worship", "Worship Together Weekly", "I", "lesson", "Heb 10:25", "Don't forsake gathering.", ["Pick a church or stream.", "Worship side by side.", "Discuss the sermon."]],
      ["dream-list", "Bucket-List Together", "V", "lesson", "Hab 2:2", "Dream out loud.", ["Write 20 shared dreams.", "Pick one for this year.", "Plan first step."]],
      ["family-mission", "Family Mission Statement", "V", "lesson", "Josh 24:15", "As for me and my house.", ["List 5 family values.", "Draft a 1-sentence mission.", "Print and hang it."]],
      ["sabbath-together", "Sabbath Together Weekly", "I", "challenge", "Ex 20:8", "Build a rest rhythm.", ["Pick a 24h block.", "No work, no rush.", "Linger together."]],
      ["repair-rituals", "Repair Rituals", "R", "lesson", "Matt 5:24", "Reconcile quickly.", ["Pick a phrase to signal repair.", "Use it tonight if needed.", "Pray after."]],
      ["legacy-prayer", "Pray a Legacy Prayer", "E", "journal", "Ps 78:6-7", "Disciple the generation to come.", ["Pray over future grandchildren.", "Write the prayer down.", "Date it."]],
    ],
    motherhood: [
      ["pray-over-each-child", "Pray Over Each Child by Name", "I", "journal", "Lam 2:19", "Lift them by name.", ["Make a list.", "One specific prayer per child.", "Date answered prayers."]],
      ["bedtime-prayer", "Bedtime Prayer Ritual", "I", "challenge", "Deut 6:7", "End the day with God.", ["Same time nightly.", "One verse + one prayer.", "Bless their head."]],
      ["scripture-of-the-week", "Family Verse of the Week", "I", "lesson", "Ps 119:11", "Hide His Word together.", ["Pick one verse.", "Post it visibly.", "Quote it daily."]],
      ["discipline-with-grace", "Discipline With Grace", "R", "lesson", "Heb 12:11", "Discipline yields fruit.", ["Define rules clearly.", "Discipline calmly.", "Restore quickly."]],
      ["one-on-one-time", "1:1 Time With Each Child", "I", "challenge", "Mark 10:16", "Touch their heart, not just their head.", ["15 min undivided per child.", "Let them lead.", "Listen."]],
      ["mom-self-care", "Mom Self-Care Without Guilt", "U", "lesson", "Mark 6:31", "Withdraw to refill.", ["Schedule 2h alone weekly.", "No apology.", "Return refreshed."]],
      ["screen-time-boundaries", "Screen-Time Boundaries", "T", "lesson", "Phil 4:8", "Guard what enters their eyes.", ["Set weekday/weekend limits.", "Use a basket.", "Replace with reading."]],
      ["raise-readers", "Raise Readers", "V", "lesson", "Deut 6:7", "Read together daily.", ["Stock a basket of books.", "Read aloud nightly.", "Library trip weekly."]],
      ["family-dinner", "Anchor: Family Dinner", "U", "challenge", "Ps 128:3", "Around the table is sacred.", ["No phones.", "One high, one low each.", "End in prayer."]],
      ["honoring-parents", "Teach Honor", "U", "lesson", "Ex 20:12", "Honor is a posture.", ["Catch them honoring.", "Praise it loudly.", "Model it yourself."]],
      ["age-appropriate-chores", "Age-Appropriate Chores", "U", "lesson", "Prov 22:6", "Train them to serve.", ["Make a per-age list.", "Assign weekly.", "Inspect with love."]],
      ["scripture-memory-family", "Family Scripture Memory", "I", "challenge", "Ps 119:11", "Hide His Word.", ["Pick a passage.", "Recite daily.", "Reward mastery."]],
      ["mom-prayer-walk", "Mom Prayer Walk", "I", "journal", "Phil 4:6", "Move and pray.", ["Walk 15 min.", "Pray each child by name.", "Note one promise."]],
      ["sabbath-with-kids", "Sabbath With Kids", "I", "challenge", "Ex 20:8", "Rest is taught.", ["Pick a slow morning.", "No errands.", "Play together."]],
      ["raising-givers", "Raise Givers", "U", "lesson", "2 Cor 9:7", "Generosity is taught.", ["Give a giving jar.", "Pick a cause together.", "Give it joyfully."]],
      ["teach-prayer", "Teach Them to Pray", "I", "lesson", "Matt 6:9-13", "The Our Father is the model.", ["Pray it together.", "Translate each line.", "Pray spontaneously."]],
      ["healthy-friends", "Discern Their Friends", "T", "lesson", "1 Cor 15:33", "Bad company corrupts.", ["Know each friend's family.", "Invite them in.", "Pray over influence."]],
      ["raising-worshippers", "Raise Worshippers", "I", "lesson", "Ps 22:3", "He inhabits praise.", ["Play worship daily.", "Sing in the car.", "Dance freely."]],
      ["legacy-stories", "Tell Legacy Stories", "E", "journal", "Ps 78:4", "Tell the next generation.", ["Tell 1 God-story weekly.", "Write it down.", "Pass it forward."]],
      ["mom-mentor", "Find a Mom Mentor", "E", "lesson", "Titus 2:3-5", "Older women teach younger.", ["Identify one mom.", "Ask her one question.", "Pray over the conversation."]],
    ],
  };

  const pre = presets[cat];
  if (pre) {
    return pre.map((p) => t(p[0], p[1], p[2], p[3], p[4], p[5], p[6]));
  }

  // Generic 20-topic skeleton — readable, varied, and shift-tagged.
  const themes = [
    ["foundations", "Foundations", "lesson", "Ps 11:3", "Build on the rock."],
    ["daily-practice", "Daily Practice", "challenge", "Lam 3:22-23", "Cultivate a daily rhythm."],
    ["heart-check", "Heart Check", "quiz", "Ps 139:23", "Search me, O God."],
    ["scripture-anchor", "Scripture Anchor", "lesson", "Ps 119:105", "His Word as a lamp."],
    ["small-shifts", "Small Daily Shifts", "challenge", "Zech 4:10", "Don't despise small beginnings."],
    ["root-cause", "Find the Root", "journal", "Heb 12:15", "Pull up roots of bitterness."],
    ["renewing-mind", "Renewing the Mind", "lesson", "Rom 12:2", "Be transformed."],
    ["the-better-yes", "The Better Yes", "lesson", "Matt 6:33", "Seek first."],
    ["weekly-review", "Weekly Review", "journal", "Ps 90:12", "Number your days."],
    ["prayer-prompts", "Prayer Prompts", "journal", "Phil 4:6", "Pray about everything."],
    ["habit-stack", "Habit Stack This Area", "challenge", "Gal 6:9", "Don't grow weary."],
    ["story-test", "The Story Test", "quiz", "Prov 18:17", "First to speak seems right."],
    ["release-control", "Release Control", "journal", "Prov 3:5-6", "Lean not."],
    ["seasons-of-life", "Seasons of Life", "lesson", "Ecc 3:1", "A time for everything."],
    ["godly-friendships", "Godly Friendships Here", "lesson", "Prov 27:17", "Iron sharpens."],
    ["healthy-boundaries", "Healthy Boundaries", "lesson", "Prov 4:23", "Guard your heart."],
    ["worship-it-out", "Worship It Out", "challenge", "Ps 22:3", "He inhabits praise."],
    ["fast-and-pray", "Fast and Pray Here", "challenge", "Matt 6:16", "When you fast."],
    ["testimony-journal", "Testimony Journal", "journal", "Rev 12:11", "Overcome by your testimony."],
    ["mentorship", "Mentorship Path", "lesson", "Titus 2:3-5", "Be discipled, then disciple."],
  ] as const;

  return themes.map(([slug, title, kind, scripture, summary], i) =>
    t(
      slug, title, defaultShift, kind as Topic["kind"], scripture, summary,
      ["Read the scripture slowly.", "Journal one honest thought.", "Pray one specific prayer."],
    )
  ).slice(0, 20);
}

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTopic(catSlug: string, topicSlug: string) {
  const c = getCategory(catSlug);
  return c?.topics.find((t) => t.slug === topicSlug);
}

export function filterCategoriesForUser(maritalStatus?: string | null) {
  const single = ["single", "divorced", "widowed"].includes((maritalStatus || "").toLowerCase());
  return CATEGORIES.filter((c) => !single || !c.marriedOnly);
}
