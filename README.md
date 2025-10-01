Project Title:
Personal Finance Tracker with Smart Analytics

Project Statement:
The Personal Finance Tracker with Smart Analytics, an app is designed for both mobile and web
applications to help users individually manage their finances in an effective way. The users can
track income, expenses, savings, and investments. The users can scan or upload documents, for
example: receipts or vouchers, and the system will save the details in the database for tracking of
their spending.
In addition, the app will provide users helpful insights into their spending habits, budgeting, and
financial goals. It also provides personalized financial data and automatic advice to help users
make better decisions and improve their finances by displaying expenses trends on the
dashboard.
Moreover, the system will be easy to use, secure, and scalable. It will feature visual dashboards,
automatic transaction categorization, expenses insights, budget setting tools, reminders, and the
option to export data.
To make the application available we are trying to build the application within 3 to 4 months, and
we are going to use Agile methods with regular updates and feedback from stakeholders.
Project Stakeholders:

Stakeholder	- Role	- Description
Product Owner	- Business Representative	- Represents the business needs, defines features, and sets development priorities.
Project Manager	- Project Oversight	- Ensures timely delivery, manages scope, budget, and resources.
Development Team	- Full-Stack Developers -	Responsible for implementing frontend and backend features.
UI/UX Designers	- Design Team	Design - intuitive and user-friendly interfaces for mobile and web platforms.
QA Testers	- Quality Assurance	- Test the application for bugs and ensure it meets functional requirements.
Data Analyst / AI Specialist	- Analytics & Intelligence Expert	- Designs and implements smart analytics and recommendation algorithms.
End Users	- Application Users	- Individuals looking to manage personal finances through tracking and insights.
Marketing Team	- Promotion & User Acquisition	- Responsible for branding, marketing campaigns, user onboarding, and app launch.
Support Team	- Post-Launch Support	- Handles user queries, feedback, and technical support post-release.
Security Specialist	- Security & Compliance	- Ensures user data is secure and complies with data protection regulations.

Initial Set of Project Requirements (User Stories with Time Estimates):


User Story ID	- User Story	- Estimated Time	: Priority
US01	- As a user, I want to create an account and securely log in/out, so I can keep my data safe.- 5 days	: High
US02	- As a user, I want to add, edit, or delete income and expense transactions, so I can track my cash flow.	- 7 days	: High
US03	- As a user, I want the app to automatically categorize transactions, so I don't have to do it manually.	- 6 days	: High
US04	- As a user, I want to set monthly budgets by category, so I can control my spending.	- 5 days	: High
US05	- As a user, I want to view a dashboard with visualizations (pie charts, bar graphs), so I can easily understand my finances.	- 7 days : High
US06	- As a user, I want to receive smart spending insights and alerts (e.g., overspending), so I can make informed decisions.	- 10 days	: Medium
US07	- As a user, I want to set savings goals and track my progress, so I can plan for the future.	- 6 days	: Medium
US08	- As a user, I want to export my financial data to CSV or PDF, so I can analyze it offline or share it.	- 4 days	: Medium
US09	- As a user, I want to receive monthly summary reports via email, so I can review my performance.	- 5 days	: Low
US10	- As a user, I want the app to have multi-device sync (web & mobile), so I can access data from anywhere.	- 10 days	: High
US11	- As a user, I want to secure my data using encryption and biometric login options, so I can feel safe.	- 6 days	: High
US12	- As a user, I want to get personalized financial advice powered by AI, so I can optimize my finances.	- 10 days	: Medium
US13	- As a user, I want to receive reminders for bill payments or recurring expenses, so I don’t miss due dates.	- 5 days	: Medium
US14	- As a user, I want to connect to my bank accounts via APIs, so transactions can be imported automatically.	- 12 days :	High
US15	- As a user, I want to change app themes (dark/light mode), so I can customize my experience.	- 3 days :	Low
US16	- As a registered user, I want to log in and log out from multiple devices securely, so I can manage my account easily.	- 4 days	: High
US17	- As a user, I want to input income, expense, savings, debt, and investment data, so I can fully track my financial situation.	- 6 days	: High
US18	- As a user, I want to scan physical vouchers or receipts using my camera, so I can enter transactions faster.	- 8 days	Medium
US19	- As a user, I want the system to extract and auto-fill data from scanned vouchers (e.g., amount, date, category), so I save time.	- 10 days	: High


---

## IST 303 Team Project — Part A Deliverables

### Team
- Cesar Barrera (@cbarrera)  <!-- adjust handle if needed -->
- Sameer Alghamdi (@sameer-alghamdi)
- Tech Shah (@techshah786)
- sjrim12 (@sjrim12)
- Czar-phd (@Czar-phd)
- Oucheoma (@Oucheoma)
- techshah787 (@techshah787)

**Team meeting(s):**
- 2025-09-15 — attendees: CB, SA, TS, SJ, CZ, UO, TS7 — chose concept, drafted stories.
- 2025-09-22 — reviewed scope for Milestone 1.0; assigned research tasks.

### Tech Stack
Python 3 + Flask, Jinja2 templates, SQLite (dev), PyTest.

### Stakeholders (with rationale)
- End Users — primary value and usability.
- Product Owner (Instructor/Client) — prioritization and acceptance.
- Developers (Team) — implementation and code quality.
- UI/UX (Team hat) — accessibility & ease of use.
- QA/Test (Team hat) — verifies functionality and prevents regressions.
- Security/Compliance (Team hat) — safe handling of PII, auth, secrets.
- Support (Team hat) — issues and feedback post-release.

### Initial User Stories (hours + acceptance criteria)
| ID | User Story | Est (hrs) | Priority | Acceptance Criteria |
|---|---|---:|:--:|---|
| US01 | As a user, I can create an account and log in/out securely. | 10 | High | Register/login happy path; hashed passwords; invalid creds rejected. |
| US02 | As a user, I can add/edit/delete income & expense transactions. | 14 | High | CRUD works; validation; list updates. |
| US03 | As a user, I can categorize transactions (manual). | 8 | High | Category dropdown; filter by category. |
| US04 | As a user, I can set a monthly budget per category. | 10 | High | Create/update budget; invalid values blocked. |
| US05 | As a user, I can see a dashboard with totals & simple charts. | 12 | High | MTD totals, by-category chart; loads locally <2s. |
| US06 | As a user, I can export data to CSV. | 6 | Medium | CSV with headers; at least one test validates structure. |
| US07 | As a user, I can upload a receipt and link it to a transaction. | 12 | Medium | File types/size constrained; path stored; retrievable. |
| US08 | As a user, I receive a monthly summary (dev: console/file). | 10 | Low | Summary includes totals and top categories. |

**Deferred from 1.0 (keeps scope realistic):** ML auto-categorization, AI advice, bank API linking, native mobile/biometrics.

### Assumptions & NFRs
Minimal PII; secrets in `.env`; no `venv` or secrets in Git; keyboard-accessible forms; Chrome/Edge/Firefox current.

