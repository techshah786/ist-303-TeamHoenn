# Personal Finance Tracker with Smart Analytics

A web-first (Flask) application to help individuals track income, expenses, savings, and investments; upload receipts; and view simple dashboards and insights.

---

## Project Statement
The Personal Finance Tracker with Smart Analytics is designed for web and (later) mobile to help users manage finances effectively. Users can track income, expenses, savings, and investments; scan or upload receipts; and store details for spend tracking. The app provides insights into spending habits, budgeting, and financial goals and offers simple visual dashboards. It aims to be easy to use, secure, and scalable.

**Key features (initial vision):**
- Visual dashboards, basic categorization, budgeting, reminders
- Receipt upload and storage
- Data export (CSV), later PDF
- (Deferred) Auto-categorization, AI advice, bank API imports, native mobile

---

## Stakeholders
- **Product Owner (Instructor/Client)** — sets priorities, accepts milestones
- **Developers (Team)** — implement features, maintain quality
- **UI/UX (Team hat)** — usability and accessibility
- **QA/Test (Team hat)** — validate functionality, prevent regressions
- **Security/Compliance (Team hat)** — safe handling of user data, auth, secrets
- **Support (Team hat)** — post-release issues and feedback
- **End Users** — primary value and usability

---

## Team
- **Md Shah Alam (He/Him)** — @techshah786
- **Sameer Alghamdi** — @sameer-alghamdi
- **Cesar Barrera** — @Czar-phd
- **Ucheoma Okoma** — @Oucheoma
- **Shawn Rim** — @sjrim12

**Team meetings (evidence):**
- 2025-09-15 — chose concept; drafted stories
- 2025-09-22 — scoped Milestone 1.0; assigned research tasks

---

## Part A — Initial Requirements
See the full user-story backlog (US01–US19) with estimates and priorities in **[`docs/backlog.md`](docs/backlog.md)**.

**Milestone 1.0 candidates (for Part B):**
- US01 (Auth), US02 (CRUD transactions), US03 (Manual categories),
- US04 (Budgets), US05 (Dashboard), US06 (CSV export)

---

## Tech Stack
- Python 3 + Flask, Jinja2 templates
- SQLite (dev), optional PostgreSQL later
- PyTest for tests

---

## Run locally
\`\`\`bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
\`\`\`

## Test
\`\`\`bash
pytest -q
\`\`\`

---

## Repo Hygiene
- No secrets in Git; use \`.env\` locally
- Don’t commit \`venv/\`, \`__pycache__/\`, or database files (see \`.gitignore\`)
