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

export const INSTRUCTION = 'גררו את ציטוטי הפסוקים והשלימו את המעגל של תקופת השופט גדעון. הניחו כל ציטוט **על** העיגול המתאים.';

// Gideon story (Judges 6-8). 4 verses are pinned (pre-placed), 3 are draggable.
// The "loop-back" verse targets aziva again — illustrating the cycle returning to its start.
export const VERSES: VerseChunk[] = [
  // Pinned: עזיבת ה'
  {
    id: 'v_pinned_aziva',
    text: "וַיַּעֲשׂוּ בְנֵי יִשְׂרָאֵל הָרַע בְּעֵינֵי ה' (ו, א)",
    targetStepId: 'aziva',
    pinned: true,
  },
  // Pinned: שעבוד לאויבים
  {
    id: 'v_pinned_shibud',
    text: "וַיִּתְּנֵם ה' בְּיַד מִדְיָן שֶׁבַע שָׁנִים. וַתָּעׇז יַד מִדְיָן עַל יִשְׂרָאֵל, מִפְּנֵי מִדְיָן עָשׂוּ לָהֶם בְּנֵי יִשְׂרָאֵל אֶת הַמִּנְהָרוֹת אֲשֶׁר בֶּהָרִים וְאֶת הַמְּעָרוֹת וְאֶת הַמְּצָדוֹת… וְהָיָה אִם זָרַע יִשְׂרָאֵל וְעָלָה מִדְיָן וַעֲמָלֵק וּבְנֵי קֶדֶם… וַיַּשְׁחִיתוּ אֶת יְבוּל הָאָרֶץ… וְלֹא יַשְׁאִירוּ מִחְיָה בְּיִשְׂרָאֵל וְשֶׂה וָשׁוֹר וַחֲמוֹר. (ו, א-ה)",
    targetStepId: 'shibud',
    pinned: true,
  },
  // Pinned: זעקה לה'
  {
    id: 'v_pinned_zeaka',
    text: "וַיִּדַּל יִשְׂרָאֵל מְאֹד מִפְּנֵי מִדְיָן, וַיִּזְעֲקוּ בְנֵי יִשְׂרָאֵל אֶל ה' (ו, ו)",
    targetStepId: 'zeaka',
    pinned: true,
  },
  // Pinned: הקמת שופט מושיע
  {
    id: 'v_pinned_shofet',
    text: "לֵךְ בְּכֹחֲךָ זֶה וְהוֹשַׁעְתָּ אֶת יִשְׂרָאֵל מִכַּף מִדְיָן, הֲלֹא שְׁלַחְתִּיךָ… וְרוּחַ ה' לָבְשָׁה אֶת גִּדְעוֹן… (ו, יד; ו, לד)",
    targetStepId: 'shofet',
    pinned: true,
  },
  // Draggable: ניצחון במלחמה
  {
    id: 'v_nitzahon',
    text: "וַיִּתְקְעוּ שְׁלֹשׁ מֵאוֹת הַשּׁוֹפָרוֹת, וַיָּשֶׂם ה' אֵת חֶרֶב אִישׁ בְּרֵעֵהוּ וּבְכׇל הַמַּחֲנֶה, וַיָּנׇס הַמַּחֲנֶה… וַיִּצָּעֵק אִישׁ יִשְׂרָאֵל… וַיִּרְדְּפוּ אַחֲרֵי מִדְיָן (ז, כב-כג)",
    targetStepId: 'nitzahon',
  },
  // Draggable: ותשקוט הארץ
  {
    id: 'v_sheket',
    text: 'וַיִּכָּנַע מִדְיָן לִפְנֵי בְּנֵי יִשְׂרָאֵל וְלֹא יָסְפוּ לָשֵׂאת רֹאשָׁם, וַתִּשְׁקֹט הָאָרֶץ אַרְבָּעִים שָׁנָה בִּימֵי גִדְעוֹן (ח, כח)',
    targetStepId: 'sheket',
  },
  // Draggable: loop back to aziva (next round of עזיבת ה')
  {
    id: 'v_loop',
    text: "וְלֹא זָכְרוּ בְּנֵי יִשְׂרָאֵל אֶת ה' אֱלֹהֵיהֶם הַמַּצִּיל אוֹתָם מִיַּד כׇּל אֹיְבֵיהֶם מִסָּבִיב. וְלֹא עָשׂוּ חֶסֶד עִם בֵּית יְרֻבַּעַל גִּדְעוֹן כְּכׇל הַטּוֹבָה אֲשֶׁר עָשָׂה עִם יִשְׂרָאֵל (ח, לד-לה)",
    targetStepId: 'aziva',
  },
];
