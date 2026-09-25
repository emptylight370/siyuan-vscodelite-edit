---
name: issue-triage
description: Triage and handle GitHub issues for a repository - fetch and digest the issue list, produce summaries with preliminary classification suggestions, present decision cards, let the user openly decide how to proceed (self-fix with the agent's suggestions, or direct the agent to implement), then execute under strict review gates where external writes always require user review and commits follow the project's commit strategy, with cross-session progress tracking. This skill should be used when the user asks to triage, review, batch-process, fix, reply to, label, or close GitHub issues, or mentions issue ���� / issue ���� / ���� issue �б�.
---

# Issue Triage

Use the agent as an **information hub and execution proxy**, with the user as the **sole decision maker**, to triage and resolve GitHub issues for a repository. Leave all value judgments to the user; the agent contributes facts and technical judgment only. Every externally visible write operation must be reviewed by the user before it happens.

## Step 0: Project Context (Context Card)

The context card is `project-context.md`, located in the same directory as SKILL.md. It is **drafted by the agent after inspecting the repository**, written after user review, and read from that location on every subsequent run.

On startup:

1. Read `project-context.md` from the SKILL.md directory. If it exists, load it and proceed to Phase 1.
2. If it does not exist, **ask the user whether to create it**:
   - If the user agrees �� auto-fill the card by inspecting the repository (README / CONTRIBUTING, directory structure, CI configuration, issue templates, `gh label list`, etc.). Never substitute guesses for facts. Mark fields that cannot be inferred from the repository as `pending` and list them in the report (the "user preferences" field is always obtained by asking the user) �� present the draft for user review �� write it to `project-context.md`.
   - If the user declines �� apply the most conservative fallback: never auto-close issues, perform no labeling or meta-operations, and deliver all code changes via PR (the default when no commit strategy is available). State this explicitly in the first report.

Context card fields (full template in `references/project-context-template.md`):

| Field               | Content                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Repository info     | `owner/repo`, default branch, issue language convention (language for replies)                                                                                                                         |
| Issue label list    | Actual labels pulled via `gh label list` (with semantic descriptions). **Labeling may only use labels from this list**; creating new labels requires user consent first, followed by updating the list |
| Project conventions | Code structure, key directories, mandatory checklists for changes, lint/test commands                                                                                                                  |
| Change red lines    | Files/behaviors that must not be touched (e.g., config schema versions, release process)                                                                                                               |
| Closure strategy    | When an issue may be closed after a fix (immediately / after verification / after release), and intermediate-state labels (must exist in the label list)                                               |
| Commit strategy     | Delivery form for code changes: direct commit, or new branch with a PR (default to PR when undeclared)                                                                                                 |
| User preferences    | Obtained by asking the user and persisted: whether progress tracking is enabled, the progress directory, etc.; applied directly on subsequent runs without re-asking                                   |

## Phase 1: Fetch & Digest

1. **Fetch the list**: Filter with `gh issue list` by state/label/time, capped with a limit (at most 10-20 issues per round, sorted by activity/recency). Output an overview table (number, title, labels, last activity, linked PR).
2. **Read each issue in depth**: Body plus comments, producing a summary from a fixed template. Rate limiting: for issues with more than 50 comments, extract only the original post, the 20 most recent, and the top-voted comments. The summary covers: the core request (one sentence), key facts (reproduction path, errors, environment, points of disagreement), and related leads (relevant files, similar issues, attached PRs).
3. **Preliminary classification suggestions**: Provide **speculative suggestions** for bug / feature / docs / question / duplicate / wontfix, for user review. Highly sensitive conclusions such as "duplicate" or "wontfix" must include evidence (duplicate issue number, quoted discussion), and must never trigger automatic closure. Also flag **information gaps** (points requiring follow-up questions).
4. **Persist progress**: Before the first write, ask the user **whether to enable progress tracking** and **which directory to use** (default suggestion: a subfolder named after the skill under the running tool's data subdirectory, e.g. `.codebuddy/issue-triage/`, `.claude/skills/issue-triage/`; the user may also pin any other path). After confirmation, write "enabled + path" into the context card's **user preferences**; apply the preference on subsequent runs without re-asking. Skip persistence if not enabled. Progress tracking uses **one file per issue**: create a separate file in the progress directory for each issue (e.g. `<issue-number>.md`) recording its stage (digested / awaiting decision / executed / closed out) plus key decision notes. To resume after an interruption, scan the progress directory; each issue's progress is independent.

## Phase 2: Present, Don't Decide

5. **Decision card**: For each issue, present the factual summary, preliminary classification suggestions, cost estimate, and information gaps for reference. **Do not present a fixed options menu**; let the user decide openly how to proceed (describing intent alone is fine, no need to pick from a list).
6. **Cost estimate**: If code changes are involved, list the expected impact surface (affected modules, whether the project's mandatory checklists are triggered, compatibility boundary impact) for the user to weigh.
7. **Hard rule**: All value judgments (whether to do it, whether it is a bug, whether it conflicts with the project's direction) belong to the user. Present classification conclusions as "suggestions", with the user making the final call.

## Phase 3: User-Directed Execute

8. **Open-ended prompting**: Once the user has decided on an issue, ask "how should this be handled, and by whom", **without presetting operation branches**. Typical directions include but are not limited to:
   - **User fixes it themselves**: Provide only location and advice (file, line numbers, relevant code snippets, suggested approach); do not touch the code;
   - **User directs the agent**: The user gives direction and constraints, and the agent implements;
   - Any other operation (drafting a reply, follow-up questions, labeling, closing, etc.) is openly specified by the user; never choose on their behalf.
9. **Constraints whenever the agent implements** (always in effect, regardless of what the user specifies):
   - **Code changes**: Implement following the project's conventions, and **never touch the change red lines** declared in the context card �� run the project's lint/test �� show the diff �� after user confirmation, deliver per the **commit strategy** - create a PR (body references the issue number; merging is decided by the user) or create a direct commit; default to PR when the commit strategy is undeclared; commit messages follow Conventional Commits and reference the issue number;
   - **External text (replies / follow-up questions)**: Match the **issue author's** language (fall back to the context card's issue language convention when undetectable) �� user review �� publish via `gh issue comment`; never publish unreviewed;
   - **Meta-operations (labeling, milestone changes, closing, transfers)**: Labeling may **only use labels from the label list**; never create labels unilaterally - obtain user consent first and update the list afterward. All of these are externally visible writes requiring user review before execution; closures must include a closing reason.

## Phase 4: Close the Loop

10. **State policy**: Never auto-close by default. Apply the closure strategy from the context card (when that field is `pending`, apply the default "never auto-close" and prompt the user to complete it in the report); label issues awaiting verification with an intermediate-state label (it must exist in the label list - if missing, obtain user consent to create it first; when the user has declined to create a context card, perform no labeling at all).
11. **Record associations**: Keep issue number references in commits, PRs, comments, and label changes so changelog tooling (git-cliff, etc.) can group them automatically.
12. **Loop**: Update the corresponding issue's progress file (if tracking is enabled) �� return to Phase 1 for the next issue until the round's queue is empty. To resume after an interruption, scan the progress directory for each issue's progress and skip completed stages.

## Universal Invariants (red lines for every project)

- **Every externally visible write operation** (comments, labels, milestones, closures, transfers, PRs) **must be reviewed by the user first**
- Code changes must pass the project's own check commands before committing; the delivery form (commit / PR) follows the context card's commit strategy, defaulting to PR when undeclared
- After each round, report using a fixed template:
  1. Number of issues processed this round
  2. Status table for each issue
  3. List of items awaiting user action
  4. Suggestions for the next round
