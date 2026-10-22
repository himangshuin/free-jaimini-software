# Jaimini Kundli

Static, dependency-free Jaimini astrology app (HTML, CSS, JavaScript). Runs in the browser; open `index.html` through any web server or GitHub Pages.

Built from the Jyotish Kundli (v17) ephemeris, chart drawing and place search, with all Parashari features removed (Vimshottari, KP, Ashtakavarga, yogas, panchang, matching, BPHS guide, Pataki, Sudarshana).

## Features (source: Jaimini Sutras, Rao/Raman, Adhyaya 1 and 2)
- Rashi drishti, Argala and Virodhargala (Su 1.1.2-10)
- Chara Karakas ranked by arc-minutes then seconds (degrees ignored; Rahu/Ketu excluded), Atmakaraka, Karakamsa
- Arudha Padas A1-A12, Upapada, Hora and Ghatika Lagna (Su 1.1.29-34)
- Chara Dasha with Antardasha, Paka/Bhoga signs and a strength reading (Su 1.1.28, 2.3.28, 2.3.35-36, 2.4.2-6)
- Yogardha Dasha (Su 2.4.19-20) and Rasi strength ranking (Su 2.3.5-17)
- Natural karakas and day/night parent karakas
- Gender input: wife/husband wording and the Su 2.4.7 reference sign (Lagna for men, 7th for women when strong)
- Life Areas tab: career, wealth, marriage, children, siblings, parents, learning, home, dharma, health
- Graded Chara Dasha timeline with a next-five-years table
- About 25 rule-based readings per chart from Su 1.2 (Karakamsa), 1.3 (Arudha Lagna), 1.4 (Upapada, children, siblings), each citing the sutra and the chart fact behind it
- Charts: D1, D9, Karakamsa and Arudha Lagna, in East, North and South Indian styles

## Not included
Adhyaya 2 longevity and death-timing sutras, spouse disease lists, birth-legitimacy sutras, Gulikakala sutras, Sthira/Navamsa/Drig dashas.

## Files
`js/core.js` positions and ephemeris, `js/engine.js` Jaimini calculations, `js/rules.js` sutra rules, `js/app.js` interface, `js/chart.js` chart drawing.
Positions were checked against Swiss Ephemeris (Lahiri): planets within 0.1 arcminute, Lagna within 0.3 arcminute.

License: GPL-2.0-or-later (inherited from the original project).
