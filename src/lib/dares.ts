// 30 biblical Love & Respect Dares (for married/engaged/living-together women)
// and 30 Womanhood Dares (for single/divorced/widowed — same heart, different focus).

export type Dare = {
  id: string;
  title: string;
  body: string;
  verse: string;
};

export const MARRIED_DARES: Dare[] = [
  { id: "m1", title: "Affirm Him", body: "Tell your husband one specific quality you admire. Be specific. Be sincere.", verse: "Proverbs 12:25" },
  { id: "m2", title: "Pray Over Him", body: "Quietly pray a blessing over him — out loud if you can, even while he sleeps.", verse: "James 5:16" },
  { id: "m3", title: "Thank Him", body: "Thank him for one thing he does that you usually take for granted.", verse: "1 Thess 5:18" },
  { id: "m4", title: "Serve in Secret", body: "Do one small act of service without being asked — and without expecting thanks.", verse: "Galatians 5:13" },
  { id: "m5", title: "Encourage Mid-Day", body: "Send him a text reminding him you believe in him.", verse: "Hebrews 10:24" },
  { id: "m6", title: "Listen Fully", body: "When he speaks today, set down your phone, look at him, and listen without preparing your response.", verse: "James 1:19" },
  { id: "m7", title: "Gentle Touch", body: "Offer a gentle, non-demanding touch — a hand on his back, a hug, a kiss.", verse: "Song 2:6" },
  { id: "m8", title: "Speak Life", body: "Say nothing negative about him today — to him, about him, or in your mind.", verse: "Ephesians 4:29" },
  { id: "m9", title: "Pray With Him", body: "Ask if you can pray a short prayer together — even one sentence.", verse: "Matthew 18:20" },
  { id: "m10", title: "Make His Favorite", body: "Prepare his favorite food or drink as a small love offering.", verse: "Proverbs 31:15" },
  { id: "m11", title: "Forgive Today", body: "Release one thing he did that has lingered in your heart. Surrender it to God.", verse: "Colossians 3:13" },
  { id: "m12", title: "Speak Respect", body: "Say one sentence that begins, 'I respect you because…'", verse: "Ephesians 5:33" },
  { id: "m13", title: "Hand-Written Note", body: "Leave a short hand-written note where he'll find it today.", verse: "Proverbs 16:24" },
  { id: "m14", title: "Ask Curiously", body: "Ask him: 'What's one thing on your heart right now?' Then listen.", verse: "Proverbs 20:5" },
  { id: "m15", title: "Bless His Work", body: "Pray over his hands, his mind, and his calling today.", verse: "Psalm 90:17" },
  { id: "m16", title: "Surrender Control", body: "Let him lead one small decision today without pushback.", verse: "Ephesians 5:22" },
  { id: "m17", title: "Speak Well of Him", body: "Speak well of your husband to someone else today — within his hearing if you can.", verse: "Proverbs 31:28" },
  { id: "m18", title: "Sit Beside Him", body: "Choose to physically sit close to him today, even briefly.", verse: "Ecclesiastes 4:9" },
  { id: "m19", title: "Receive His Gift", body: "Receive a kindness from him with full appreciation, no critique.", verse: "James 1:17" },
  { id: "m20", title: "Apologize First", body: "If there's tension, be the first to apologize — even for your tone.", verse: "Matthew 5:9" },
  { id: "m21", title: "Eye Contact at Dinner", body: "Look him in the eyes during a meal today. Smile.", verse: "Numbers 6:25" },
  { id: "m22", title: "Dream Together", body: "Ask: 'What's one dream you haven't talked about lately?'", verse: "Habakkuk 2:2" },
  { id: "m23", title: "Bless Him Out Loud", body: "Speak Numbers 6:24-26 over him before he leaves the house.", verse: "Numbers 6:24-26" },
  { id: "m24", title: "Ask How to Pray", body: "Ask him how you can pray for him today — then actually pray it.", verse: "Philippians 4:6" },
  { id: "m25", title: "Choose Tone", body: "Speak softly today — even if you feel justified to be sharp.", verse: "Proverbs 15:1" },
  { id: "m26", title: "Plan One Joy", body: "Plan one small joy this week — a walk, coffee out, a favorite show together.", verse: "Ecclesiastes 9:9" },
  { id: "m27", title: "Receive His Touch", body: "When he reaches for you today, lean in — don't pull away.", verse: "Song 7:10" },
  { id: "m28", title: "Praise His Effort", body: "Notice and name something he is trying to do well right now.", verse: "1 Cor 13:7" },
  { id: "m29", title: "Sabbath With Him", body: "Build in 30 quiet minutes today with no screens, just together.", verse: "Mark 6:31" },
  { id: "m30", title: "Speak His Name in Prayer", body: "Say your husband's name out loud in prayer today. Bring him before the throne.", verse: "Jeremiah 29:12" },
];

export const SINGLE_DARES: Dare[] = [
  { id: "s1", title: "Affirm Yourself in Christ", body: "Speak one true thing God says about you out loud today.", verse: "Psalm 139:14" },
  { id: "s2", title: "Pray for Your Future", body: "Pray for the woman you are becoming — and (if applicable) for a future spouse.", verse: "Jer 29:11" },
  { id: "s3", title: "Thank God in This Season", body: "Write down three gifts that exist only in this season.", verse: "1 Thess 5:18" },
  { id: "s4", title: "Serve in Secret", body: "Do one act of kindness no one will see except God.", verse: "Matthew 6:3-4" },
  { id: "s5", title: "Encourage a Friend", body: "Text someone today: 'I see God in you. Here's how…'", verse: "Hebrews 10:24" },
  { id: "s6", title: "Listen Fully", body: "Put your phone down for one full conversation today.", verse: "James 1:19" },
  { id: "s7", title: "Cultivate Beauty", body: "Care for your body or your space as worship — not performance.", verse: "1 Cor 6:19" },
  { id: "s8", title: "Speak Life", body: "Refuse to gossip, complain, or self-criticize today.", verse: "Ephesians 4:29" },
  { id: "s9", title: "Pray With Someone", body: "Ask a friend if you can pray over them today.", verse: "Matthew 18:20" },
  { id: "s10", title: "Cook Worship", body: "Prepare a meal slowly and intentionally as an act of love.", verse: "Colossians 3:23" },
  { id: "s11", title: "Forgive Today", body: "Release one person who has hurt you. Surrender it to God.", verse: "Colossians 3:13" },
  { id: "s12", title: "Honor Authority", body: "Speak respect about a leader, parent, pastor, or boss today.", verse: "Romans 13:1" },
  { id: "s13", title: "Send a Note", body: "Mail or hand-write a short encouragement to someone.", verse: "Proverbs 16:24" },
  { id: "s14", title: "Ask the Spirit", body: "Sit quietly and ask the Holy Spirit, 'What's on Your heart for me today?'", verse: "John 16:13" },
  { id: "s15", title: "Bless Your Work", body: "Pray over your hands, mind, and calling before you begin work.", verse: "Psalm 90:17" },
  { id: "s16", title: "Surrender a Plan", body: "Release one outcome you've been gripping. Open your hands.", verse: "Proverbs 3:5-6" },
  { id: "s17", title: "Speak Well of Others", body: "Praise someone publicly today — to their face or in front of others.", verse: "Proverbs 31:28" },
  { id: "s18", title: "Be Present", body: "Be fully where your feet are today — no scrolling past this moment.", verse: "Psalm 118:24" },
  { id: "s19", title: "Receive a Gift", body: "Accept a compliment or help today without deflecting.", verse: "James 1:17" },
  { id: "s20", title: "Apologize First", body: "Mend one strained relationship today — make the first move.", verse: "Matthew 5:9" },
  { id: "s21", title: "Eat With Joy", body: "Eat one meal slowly today, with gratitude, with no distraction.", verse: "Ecc 9:7" },
  { id: "s22", title: "Dream With God", body: "Write down a dream you've been afraid to name. Show it to God.", verse: "Habakkuk 2:2" },
  { id: "s23", title: "Bless Yourself Aloud", body: "Speak Numbers 6:24-26 over yourself in the mirror today.", verse: "Numbers 6:24-26" },
  { id: "s24", title: "Pray for a Friend", body: "Ask a friend how you can pray — and actually pray.", verse: "Philippians 4:6" },
  { id: "s25", title: "Soft Words", body: "Choose softness today — especially in moments you feel justified.", verse: "Proverbs 15:1" },
  { id: "s26", title: "Plan One Joy", body: "Schedule something delightful for this week. Beauty is allowed.", verse: "Ecc 9:9" },
  { id: "s27", title: "Move Your Body", body: "Walk, stretch, or dance today as gratitude for the body God gave you.", verse: "Romans 12:1" },
  { id: "s28", title: "Notice Beauty", body: "Take a photo of one beautiful thing today. Thank the Maker.", verse: "Psalm 19:1" },
  { id: "s29", title: "Sabbath Quiet", body: "Build in 30 quiet, screen-free minutes today. Just be.", verse: "Mark 6:31" },
  { id: "s30", title: "Say His Name", body: "Say Jesus' name out loud today. He hears.", verse: "Jeremiah 29:12" },
];

export function getDareDeck(maritalStatus?: string | null): Dare[] {
  const single = ["single", "divorced", "widowed"].includes((maritalStatus || "").toLowerCase());
  return single ? SINGLE_DARES : MARRIED_DARES;
}

export function dareLabel(maritalStatus?: string | null) {
  const single = ["single", "divorced", "widowed"].includes((maritalStatus || "").toLowerCase());
  return single ? "Today's Womanhood Dare" : "Today's Love & Respect Dare";
}
