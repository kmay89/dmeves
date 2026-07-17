# dmeves.com — The Classroom

An interactive, isometric high-school **physical science classroom**, drawn
entirely in code. Every object in the room maps to something a class actually
uses, so students explore the room instead of scrolling a list of links:

| In the room | What it opens |
| --- | --- |
| Chalkboard | Syllabus, this week's plan, homework (→ Google Classroom) |
| Smart board | Class goals & dreams for the year |
| Periodic table poster | A full interactive periodic table — all 118 elements |
| Lab bench | Scientific method, lab report template |
| The thinking flask | A step-by-step **hypothesis builder** students can copy from |
| Safety corner | Lab safety rules, shower/eyewash, safety contract |
| The globe | An animated solar system orrery |
| Wall clock | The bell schedule — live, it knows what period it is |
| Calendar | Class calendar (the paper one draws the real current month) |
| Teacher's desk | Office hours, extra help, contact |
| Bookshelf | Online textbook & readings |
| The door | "What did I miss?" → the Classroom stream |

Single `index.html`, no frameworks, no build step, no trackers. Sound is
synthesized in the browser and off until the first click. Typography is
Fredoka + Nunito + Caveat, self-hosted from `/fonts` (~120 KB total) so
no font CDN ever sees your students.

## Teacher setup

All customization lives in one clearly-marked block at the top of the
`<script>` in `index.html` — search for **`TEACHER SETUP`**:

```js
var CONFIG = {
  course:  "Physical Science",
  teacher: "D. Meves",
  room:    "Room 113",
  ...
  links: {
    classroom: "https://classroom.google.com/",
    syllabus:  "",        // paste your real links here
    homework:  "",
    ...
  },
  bellSchedule: [ {p:"Period 1", s:"7:45", e:"8:33"}, ... ]  // 24-hour times
};
```

Paste your real Google Classroom / Docs links into `links`. Any link left
empty falls back to your main Classroom link, so nothing ever dead-ends.
Edit the bell schedule to match your building; the wall clock and its
dossier use it to tell students what period it is right now.

## Develop

It's a static file — open `index.html` in a browser, or:

```sh
python3 -m http.server
```

Deploys anywhere static hosting exists (configured here for Netlify).
