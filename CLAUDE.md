# Project instructions for Claude Code

This repo (https://github.com/lmn4121/Portfolio-Website) is Landon Nguyen's
portfolio site. Vercel deploys it from this repo: `main` is production, and PRs
get preview deployments.

The projects the site links to live on per-project branches of a separate repo,
https://github.com/lmn4121/Project-Portfolio (Capstone-Project,
Data4380-Computer-Vision, Kaggle-Project, Digital-Twin). The live digital twin
on Render deploys from Landon's private Digital-Twin repo, not from either of
these.

## Related context (not in this repo)
Planning docs (roadmap.md, course-log.md, the current resume) live on Landon's
computer and in a Cowork project, NOT in this repo. Claude Code runs in the
cloud and cannot read them. Landon pastes or attaches what a task needs at the
start of the session (usually a self-contained task file such as
`portfolio-updates.md`, or the relevant course-log entry).

If a task depends on details you weren't given (metrics, what was built,
course names), check this repo's notebooks/reports/READMEs first, then ask
Landon. Don't guess.

## Site conventions
- Each project entry follows the existing pattern: title, course/context tag,
  2-3 bullet summary, "Techniques" line, "Results" line, link to GitHub branch.
  See existing entries (Infant Mortality Capstone, Chest X-Ray Classification,
  Digital Twin) as the template for tone and structure.
- Keep bullet summaries factual and specific (numbers, model names, metrics) —
  match the existing voice, not generic marketing language.
- Don't invent results or metrics not confirmed by the user or found in this repo.
- Always label which split a metric comes from (train / validation / test), and
  lead with the test metric. Metrics on the site must match Landon's current resume
  (he provides the relevant text or file when it matters).
- Use official course names for course tags (e.g., "DATA-4380: Data Problems");
  assignment names like "Computer Vision" can appear in the description only.

## When adding a new project
1. Use the course-log entry / notes Landon provides for what was built and what
   it's worth highlighting; fill gaps from the project's branch in this repo.
2. Draft the write-up matching the existing project card structure.
3. Confirm with the user before publishing/deploying — don't push to
   production without a review step.
4. End with a short summary of what changed (and anything left unresolved) so
   Landon can log it in his roadmap.
