---
name: Gideon game (primary)
description: משחק גדעון (שופטים ו-ח). מעגל 6 שלבים מסודר מראש. 4 פסוקים נעוצים (aziva, shibud, zeaka, shofet). 3 פסוקים לגרירה (nitzahon, sheket, loop→aziva). סיום עם הורדת PNG.
type: feature
---
# משחק גדעון - מבנה נוכחי

**שלב יחיד**: המעגל מסודר מראש (6 עיגולים, סדר נכון מקובע).

**6 שלבי המעגל** (CORRECT_ORDER):
aziva → shibud → zeaka → shofet → nitzahon → sheket → (חוזר ל-aziva)

**7 פסוקים** (VERSES):
- v_pinned_aziva (ו,א) — נעוץ ב-aziva
- v_pinned_shibud (ו,א-ה) — נעוץ ב-shibud
- v_pinned_zeaka (ו,ו) — נעוץ ב-zeaka
- v_pinned_shofet (ו,יד; ו,לד) — נעוץ ב-shofet
- v_nitzahon (ז,כב-כג) → nitzahon (גרירה)
- v_sheket (ח,כח) → sheket (גרירה)
- v_loop (ח,לד-לה) → aziva (גרירה — מציג סגירת המעגל)

**אינטראקציה**: גרירה (dnd-kit) או לחיצה על פסוק + לחיצה על עיגול.

**סיום**: כשכל הפסוקים שובצו → דיאלוג עם כפתור הורדת PNG (html-to-image) של המעגל המלא עם כותרת "מעגל תקופת השופט גדעון" ולוגו עמית.

**שמות קבצים**: הרכיבים והקבצים עדיין בשם devorah/DevorahGame מסיבות היסטוריות, אך התוכן הוא של גדעון.
