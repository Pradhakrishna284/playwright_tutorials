# GitHub Actions Session — Notes
**Source:** Github_Actions_session-20260728_130042-Meeting_Recording.mp4
**Duration:** ~29 minutes | **Date on screen:** Jul 28, 2026
**Participants visible:** Kusumanthi, Rajkumar (TR Technology) and one other attendee (avatar labeled "RP" / Pachipulusu, Radha Kris...)

> ⚠️ **Note on method:** This environment has no audio transcription available, so these notes are built from the on-screen content (screen share) at ~90-second intervals, not from what was said. Treat timestamps as approximate and captions as inferred from context — you'll want to fill in the "why"/decisions from your own memory of the conversation.

---

## Contents
1. [Timeline of screen activity](#timeline-of-screen-activity)
2. [Key GitHub Actions Concepts Illustrated](#key-github-actions-concepts-illustrated-in-this-session)
3. [Working summary](#working-summary-inferred-from-visuals)
4. [Suggested follow-ups](#suggested-follow-ups)

---

## Timeline of screen activity

**0:00 – 1:30 — Effort-tracking spreadsheet**
Excel file `Deployments Integrations with Smoke Pipelines Effort Estimates - Final.xlsx` (SharePoint). Sheet "Sign Off" shows a status grid of app components (e.g. `a202750_ocmc-app-cmc`, `a208113_oedf-app-*`, `a200206_dete-app-*`) against CI/CD stage columns:
- CICD Completed DEV / QA / SAT / UAT / PROD (OCI, AWS)
- Functional API/Service Completed for all environments
- Functional UI Smoke Completed
- Performance Smoke Completed (OCI QA, AWS SAT, AWS QA — "DEV OOS for now")
- Signed Off – DevOps / Signed Off – (cut off)

![Effort-tracking spreadsheet](images/01_spreadsheet_status.jpg)

Most rows marked **Done**; several `oedf` rows marked **Not Applicable**; one row (`a202750_ocmc-app-ui-cmc`) shown **In Progress**, with a linked Azure DevOps bug for PROD_EMEA/UAT_EMEA.

**~3:00 — GitHub PR review: compliance zone fix**
PR **#3468**, `tr/a200206_dete-app-calc`: *"ADO-5155007: Default compliance area zone option to enabled when unset."* Status: review required, "All checks have passed" (7 successful, 1 skipped), but **merging blocked** pending an approving reviewer. Checks included `pr-compliance`, `pr-workflow/build`, SecPipe Security Scan, Secret Detection.

![PR #3468 blocked pending review](images/02_pr_3468_blocked.jpg)

**~4:30 — Merged PR: reduce QA seeding frequency**
PR **#1642**, `tr/a209045_dete-config-automation`: *"Temp: reduce AD - QA schedule to once daily."* Approved by RajkumarKusumanthiTR ("looks good") and AvinashTR, merged into `develop`, branch deleted afterward.

![PR #1642 merged](images/03_pr_1642_merged.jpg)

**~6:00 — PR workflow run history**
`a200206_dete-app-calc` → Actions → "pr workflow" — history of PR-triggered runs, including repeated pushes against **Bug 5116775** ("Custom rule wrongly applied when DRC box is ticked") and **ADO-5155007** (the compliance zone item from above).

**~7:30 — `pr-workflow.yml` reviewed**
Simple reusable-workflow wrapper: triggers on `pull_request`, calls `./.github/workflows/ci-template.yml` with `ARTIFACTORY_BASE_URL` and `SONAR_HOST_URL` inputs, `secrets: inherit`.

![pr-workflow.yml](images/04_pr_workflow_yml.jpg)

**~9:00 — Open PR backlog**
`a200206_dete-app-cca` → Pull Requests: **19 open / 309 closed**. Notable items: AI-generated/AI-agent-labeled PRs (Claude, GitHub Copilot), several `AB#53125*7` CD-pipeline creation PRs, and older open items back to Oct 2025 (Marshaller fix).

**~10:30 — `ci-template.yml` reviewed**
The shared CI template (509 lines) invoked via `workflow_call`. Inputs: `ARTIFACTORY_BASE_URL`, `SNYK_ORG_ID` (with a default org GUID), `SONAR_HOST_URL`, `RELEASE_BRANCH_PREFIX` (default `release`). Required secrets: `ARTIFACTORY_USERNAME/PASSWORD`, `SONAR_TOKEN`, `SYSDIG_TOKEN`, `IDT_GITHUB_READONLY_TOKEN`, and more below the fold.

![ci-template.yml](images/05_ci_template_yml.jpg)

**~12:00 – 17:00 — Deploy-Aws-QA workflow**
`Deploy-Aws-QA` workflow: **249 runs**, all triggered manually via `github-actions` bot on `trigger/qat-i`, roughly one run per day (~15–20 min duration each). Also viewed the **all-workflows** feed for the repo (2,500+ runs total) and one **in-progress** `pr/build` run for Bug 5116775.

**~18:00 — FT-PT-Trigger-Main: full pipeline run (success)**
Repo `a209047_osdo-cnf-cicd-workflows`, run **#1321**: `FT-PT-Trigger-Main-a200206_dete-app-calc-b9e46ac42a-aws-qa-amer`. Jobs: `set-parameters` → `FT-IDT_RestPython`, `FT-IDT_RESTTests`, `FT-IDT_UI-automation`, `FT-IDT_WSTests` (parallel) → `RM_Ctask_Closure` → `PT`. All green, total duration **18m 14s**.

![FT-PT-Trigger-Main successful run](images/06_ft_pt_trigger_success.jpg)

**~19:30 – 21:00 — FT-PT-Trigger-Main run history (many failures)**
Same workflow's run list: **1,143 runs total**, and the visible page is dominated by **red ❌ failed runs** across many components (`a202750_ocmc-app-cmc`, `a200206_dete-app-config-api`, `a200206_dete-app-calc`, `a200206_dete-app-tenant-management`, `a208263_ocre-app-ce-stg-sdm`, etc.), mostly on `main`, run manually by `IDTBotTR-RO`.

![FT-PT-Trigger-Main run history dominated by failures](images/07_ft_pt_trigger_failures_list.jpg)

**~22:30 — Root cause of the failures**
Opened one failing run (`a200206_dete-app-api-jurisdictions-config`, run #1319) → job **FT-IDT_RestPython** failed at the "Trigger and Monitor workflow" step. Log shows:
```
Failed to trigger the workflow. HTTP status code 301!
Response body: {"message":"Moved Permanently", "url":"https://api.github.com/repositories/.../actions/workflows/SanityTesting.yml/dispatches", ...}
Error: Process completed with exit code 1.
```

![301 redirect error — root cause of the failures](images/08_301_error_root_cause.jpg)

**→ This looks like the main technical issue of the session:** the repo-dispatch/workflow-trigger call is hitting an old repository URL and getting a 301 redirect instead of a 2xx, causing the trigger step (and downstream sanity tests) to fail across many components.

**~24:00 — Landed on the shared workflows repo**
`tr/a209047_osdo-cnf-cicd-workflows` — README: **"Reusable CI/CD Workflows — CI/CD workflows for ONESOURCE IDT and Integrations."** 208 branches, 950 commits, categorized into CI Templates, CD Workflows, Release Management workflows. This is the central repo owning the templates used above.

![osdo-cnf-cicd-workflows repo README](images/09_cicd_workflows_repo_readme.jpg)

**~25:30 — A working Sanity Testing run for comparison**
Repo `a200206-IDT_RESTTests`, run **#597**: *"Sanity Testing in qa using a200206_dete-app-config-api..."* — **succeeded**. Jobs: Setup → several `Build1` jobs (Rest_AddEditCopyGetDeleteCustomAuthority, Rest_AddEditGetDeleteLicense, Rest_ContributingAuthorities, REST_CustomProductCategories) → Send-ms-teams-notification → stop-service. Used to contrast against the failing runs seen a moment earlier.

![Sanity Testing run — succeeded](images/10_sanity_testing_success.jpg)

**~27:00 — SOAP_2020 pipeline run (partial failure)**
`a209045_dete-app-calc` in QA for **SOAP_2020**, run #95: jobs `update-ecs` → `validate-and-setup` → `All ADOs - SOAP_2020` → `finalize` all succeeded, but the final **`stop-service`** job failed (red X).

![SOAP_2020 run — stop-service job failed](images/11_soap_2020_stop_service_fail.jpg)

---

## Key GitHub Actions Concepts Illustrated in This Session

These are general GitHub Actions concepts, explained using the specific examples that appeared on screen — useful if you want to use this recording as a mini walkthrough later, or explain the setup to someone new to the repo.

### 1. Reusable workflows (`workflow_call`)
Instead of every repo writing its own CI logic, a workflow can be defined once and *called* from many repos with `uses: <path-or-repo>/workflow.yml` + `with:` inputs.
- **Seen at ~7:30** — `pr-workflow.yml` in `a200206_dete-app-calc` was only ~12 lines: it triggers on `pull_request` and immediately calls `./.github/workflows/ci-template.yml`, passing in `ARTIFACTORY_BASE_URL` and `SONAR_HOST_URL`.
- **Seen at ~10:30** — the callee, `ci-template.yml` (509 lines), is where the real work lives: it declares `on: workflow_call:` with typed `inputs:` (`ARTIFACTORY_BASE_URL`, `SNYK_ORG_ID`, `SONAR_HOST_URL`, `RELEASE_BRANCH_PREFIX`) and a `secrets:` block.
- **Why it matters:** one bug fix or scanner upgrade in `ci-template.yml` instantly benefits every repo that calls it — this is clearly the intended design of the `osdo-cnf-cicd-workflows` repo seen at ~24:00.

### 2. `secrets: inherit`
When a caller workflow writes `secrets: inherit` (seen in `pr-workflow.yml` at ~7:30), it passes *all* of the calling repository's secrets down into the reusable workflow, instead of listing them one by one. Convenient, but worth knowing it also means the reusable workflow gets broader secret access than a manually-scoped `secrets:` block would allow.

### 3. Required status checks & branch protection
PR **#3468** (~3:00) showed **"Merging is blocked"** even though **all 7 checks passed** — because a rule required *at least one approving review from a user with write access*, and that hadn't happened yet. This is a common two-part gate in GitHub: automated checks (build, security scan, secret detection) *and* human review, both enforced before merge is allowed — decoupled from each other.

### 4. Manual triggers (`workflow_dispatch`) vs. PR-triggered workflows
Two different triggering patterns were visible side by side:
- **PR-triggered** (`pr-workflow.yml`, ~7:30): fires automatically on `pull_request` — used for CI gating.
- **Manually triggered** (`Deploy-Aws-QA`, ~12:00–17:00; `FT-PT-Trigger-Main`, ~18:00–21:00): both showed **"Manually run by github-actions [Bot]"** / **"IDTBotTR-RO"** rather than a person — meaning something (likely a scheduler, or a bot account acting on a cron/API call) is invoking `workflow_dispatch` on a routine cadence rather than a human clicking "Run workflow" each time.

### 5. Fan-out / fan-in job orchestration
The successful `FT-PT-Trigger-Main` run (~18:00, run #1321) is a good textbook example of pipeline shape:
```
set-parameters
      │
      ├──▶ FT-IDT_RestPython     ─┐
      ├──▶ FT-IDT_RESTTests       ├─▶ RM_Ctask_Closure ─▶ PT
      ├──▶ FT-IDT_UI-automation  ─┤
      └──▶ FT-IDT_WSTests        ─┘
```
One setup job "fans out" into several independent test jobs that run in parallel (each shows its own duration — e.g. `FT-IDT_WSTests` took 8m 43s while `FT-IDT_RestPython` finished in seconds), then "fans back in" to a closure/reporting stage. This pattern keeps total pipeline time close to the *slowest* parallel branch instead of the *sum* of all branches.

### 6. Cross-repo triggering via the GitHub REST API (`repository_dispatch`) — and its failure mode
The failing jobs (~19:30–22:30) weren't failing because of test logic — they were failing because a **step inside the job calls the GitHub REST API directly** to kick off another workflow (`SanityTesting.yml`) in a different repo, using a hardcoded/older API URL:
```
POST https://api.github.com/repositories/<id>/actions/workflows/SanityTesting.yml/dispatches
→ 301 Moved Permanently
```
- **Concept:** this is the `repository_dispatch` / "trigger workflow via API" pattern — powerful for chaining pipelines across repos, but brittle: if the target repo is renamed, transferred, or its numeric ID/slug changes, the old URL now 301-redirects instead of executing, and most HTTP clients used in shell scripts (like `curl` without `-L`) will treat a 301 as a failure rather than silently following it.
- **This is the standout lesson from the session:** a single stale URL reference can cascade into dozens of red ❌ runs across unrelated components, which is exactly the pattern seen in the `FT-PT-Trigger-Main` history (~19:30).

### 7. Central "workflows repo" pattern
`a209047_osdo-cnf-cicd-workflows` (~24:00) is a repo whose *only* purpose is to host shared, reusable workflow YAML — no application code. Its README explicitly documents categories: **CI Templates**, **CD Workflows**, **Release Management workflows**. This is a common scaling pattern once an org has more than a handful of repos needing consistent pipelines — it avoids copy-pasting YAML everywhere, at the cost of the coupling risk shown in point 6.

### 8. Partial pipeline failure / job-level isolation
The SOAP_2020 run (~27:00) showed `update-ecs → validate-and-setup → All ADOs → finalize` **all green**, but the final `stop-service` job **failed**. Because GitHub Actions reports success/failure *per job*, this tells you precisely that the actual deployment/test work completed — only the teardown step (stopping a service, likely used for cost control or environment reset) had a problem. That's a much smaller, more contained issue than the 301 errors above, and worth treating as a separate ticket.

---

## Working summary (inferred from visuals)

1. **Status check:** Most tracked components are through DEV/QA/SAT/UAT/PROD CI/CD and functional smoke; a handful of `oedf`/`ovat` apps are marked Not Applicable, and one `ocmc` UI component is still In Progress.
2. **Active PRs discussed:** a compliance "zone option" fix (ADO-5155007, blocked on reviewer approval) and a QA-seeding-frequency change (merged).
3. **CI/CD architecture:** individual repos call a shared `ci-template.yml` (Artifactory, Snyk, SonarQube, Sysdig integration) hosted in the central `osdo-cnf-cicd-workflows` repo; a separate `FT-PT-Trigger-Main` workflow orchestrates functional/regression/performance testing per component per environment.
4. **Problem investigated:** widespread failures in `FT-PT-Trigger-Main` runs traced to an **HTTP 301 (Moved Permanently)** when the pipeline tries to dispatch `SanityTesting.yml` via the GitHub API — almost certainly a stale/renamed repository reference in the dispatch URL. This is the most concrete action item visible in the recording.
5. **A known-good comparison run** (Sanity Testing #597) was pulled up alongside the failures, likely to compare configuration or confirm the trigger mechanism used to work.
6. Also noted: a separate `stop-service` job failure in the SOAP_2020 pipeline — possibly unrelated, worth flagging separately.

---

## Suggested follow-ups
- **Fix the 301 dispatch bug (see Concept #6):** find every workflow step that calls `api.github.com/repositories/<id>/actions/workflows/SanityTesting.yml/dispatches` and update it to the current repo path — or better, switch to `owner/repo` slug-based dispatch endpoints so a repo ID change can't break it again.
- Decide whether the ADO-5155007 PR (#3468) needs an additional reviewer to unblock merge (Concept #3).
- Investigate the `stop-service` failure in the SOAP_2020 run (#95) separately — it's isolated to one teardown job, not the broader 301 issue (Concept #8).
- Since I couldn't capture the spoken discussion, you may want to fill in: who owns the 301 fix, timeline/priority, and what was actually said about each of these.
