import type { AdviceCard } from "./types";

/** The original three advice cards, kept exactly as written. */
export const generalAdvice: AdviceCard[] = [
  {
    title: "Embrace the ragrra",
    body: "Trust, seeing hundreds of errors is not only normal, it's good. The more you're stuck on something, the better it is cuz you're ACTUALLY learning something.",
  },
  {
    title: "Build to learn",
    body: "Reading docs or watching tutorials is good, but actually building projects no matter how small, breaking them, and debugging them is how you learn.",
  },
  {
    title: "Make it a hobby not a full time j*b",
    body: "Devoting even just 45 minutes of daily, high-focus effort is sooo much better than trying to do 8 hour sprints and then burning yourself out and losing all your spark.",
  },
];

/** Things nobody tells beginners, added for the revamp. */
export const nobodyTellsYou: AdviceCard[] = [
  {
    title: "Everyone googles everything",
    body: "Senior developers google array methods they've used a thousand times. Nobody memorises the syntax, they memorise the concepts and look up the details. If you think you're the only one with fifteen tabs open, you're not.",
  },
  {
    title: "Tutorial hell is real",
    body: "Watching someone else build a thing feels like learning because it's comfortable and nothing goes wrong. Building it yourself feels awful because everything goes wrong. The awful one is the one that works. Close the video after the concept and go break something.",
  },
  {
    title: "You will forget things",
    body: "You'll learn closures, understand them completely, and then blank on them two months later. That's normal and it isn't failure. It comes back much faster the second time, and faster again the third.",
  },
  {
    title: "Reading code is a separate skill",
    body: "Most people practice writing code and never practice reading it, and then a real codebase feels impossible. Open a small open source repo, pick one feature, and trace how it works end to end. It's uncomfortable at first and then it's a superpower.",
  },
  {
    title: "The error message is talking to you",
    body: "The number of hours lost to not reading the actual error is genuinely tragic. Read the whole thing, including the file and line. Then read the stack trace bottom-up in Python, top-down in JavaScript. Half the time the fix is written right there.",
  },
  {
    title: "Finish things, even small ones",
    body: "Ten half-built projects teach you the same first 20% ten times. One finished ugly project teaches you deploying, edge cases, empty states and the part where you realise you have to write a README. Finish it, then move on.",
  },
  {
    title: "Comparison is a trap",
    body: "Someone on Twitter is always shipping something impressive at 19. You don't see their four previous years, or the parts they got help with, or the projects they abandoned. Compare yourself to you from three months ago, that's the only honest measurement.",
  },
  {
    title: "Time estimates on this site are ranges, not promises",
    body: "Every duration here assumes consistent practice and actually building things, not just reading. If it takes you twice as long, that says nothing about you — it might mean you're going deeper, or that you have a job, or that the week was rough. The order matters much more than the pace.",
  },
];
