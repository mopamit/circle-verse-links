export interface CycleStep {
  id: string;
  label: string;
}

export interface VerseChunk {
  id: string;
  text: string;
  targetStepId: string;
  /** If true, the verse is pre-placed and not draggable */
  pinned?: boolean;
}

// Correct order around the cycle (clockwise starting from top)
export const CORRECT_ORDER: CycleStep[] = [
  { id: 'aziva', label: "עזיבת ה'" },
  { id: 'shibud', label: 'שעבוד\nלאויבים' },
  { id: 'zeaka', label: "זעקה לה'\nורחמיו" },
  { id: 'shofet', label: 'הקמת\nשופט -\nמושיע' },
  { id: 'nitzahon', label: 'ישועה\nוניצחון\nבמלחמה' },
  { id: 'sheket', label: 'ותשקוט\nהארץ' },
];

export const INSTRUCTION = 'גררו את ציטוטי הפסוקים לתוך העיגולים המתאימים במעגל (הניחו את הציטוט **על** המעגל המתאים) והשלימו את המעגל של תקופת השופטת דבורה.';

// All verses (one is pinned, the rest are draggable). The "loop-back" verse (vi)
// targets aziva again — illustrating the cycle returning to its start.
export const VERSES: VerseChunk[] = [
  {
    id: 'v_pinned',
    text: "וַיֹּסִפוּ בְּנֵי יִשְׂרָאֵל לַעֲשׂוֹת הָרַע בְּעֵינֵי ה', וְאֵהוּד מֵת. (ד,א)",
    targetStepId: 'aziva',
    pinned: true,
  },
  {
    id: 'v_shibud',
    text: "וַיִּמְכְּרֵם ה' בְּיַד יָבִין מֶלֶךְ כְּנַעַן אֲשֶׁר מָלַךְ בְּחָצוֹר, וְשַׂר צְבָאוֹ סִיסְרָא וְהוּא יוֹשֵׁב בַּחֲרֹשֶׁת הַגּוֹיִם… כִּי תְּשַׁע מֵאוֹת רֶכֶב בַּרְזֶל לוֹ וְהוּא לָחַץ אֶת בְּנֵי יִשְׂרָאֵל בְּחׇזְקָה עֶשְׂרִים שָׁנָה. (ד, ב-ג)",
    targetStepId: 'shibud',
  },
  {
    id: 'v_zeaka',
    text: "וַיִּצְעֲקוּ בְנֵי יִשְׂרָאֵל אֶל ה' (ד, ג)",
    targetStepId: 'zeaka',
  },
  {
    id: 'v_shofet',
    text: 'וּדְבוֹרָה אִשָּׁה נְבִיאָה אֵשֶׁת לַפִּידוֹת הִיא שֹׁפְטָה אֶת יִשְׂרָאֵל בָּעֵת הַהִיא. … וַתִּשְׁלַח וַתִּקְרָא לְבָרָק בֶּן אֲבִינֹעַם מִקֶּדֶשׁ נַפְתָּלִי וַתֹּאמֶר אֵלָיו הֲלֹא צִוָּה ה\' אֱלֹהֵי יִשְׂרָאֵל ... (ד, ד-ו)',
    targetStepId: 'shofet',
  },
  {
    id: 'v_nitzahon',
    text: 'וַיַּכְנַע אֱלֹקִים בַּיּוֹם הַהוּא אֵת יָבִין מֶלֶךְ כְּנָעַן לִפְנֵי בְּנֵי יִשְׂרָאֵל: (ד, כג)',
    targetStepId: 'nitzahon',
  },
  {
    id: 'v_sheket',
    text: '...וַתִּשְׁקֹט הָאָרֶץ אַרְבָּעִים שָׁנָה: (ה, לא)',
    targetStepId: 'sheket',
  },
];
