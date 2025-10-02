# Part B — Plan

## Milestone 1.0 scope
US01–US06 (auth, CRUD, manual categories, budgets, dashboard, CSV).

## Velocity & effort
Team velocity basis: ~30 hours/week.  
Total est. for M1.0 ≈ 60 hours → fits 2 iterations.

## Iteration plan
- **Iteration 1 (Today → EOD):** US01, US02, US03 (≈32h)
- **Iteration 2 (Tomorrow → EOD):** US04, US05, US06 (≈28h)

## Task allocation (owners)
- **US01** Md Shah Alam — auth routes, user model, tests (10h)
- **US02** Sameer Alghamdi — transactions model, CRUD pages, tests (14h)
- **US03** Shawn Rim — categories + filters + tests (8h)
- **US04** Ucheoma Okoma — budgets model/UI + tests (10h)
- **US05** Cesar Barrera — aggregates + simple chart + tests (12h)
- **US06** Md Shah Alam — CSV export + tests (6h)

## Decomposition examples (traceability)
- US02 → [model + migration], [create/edit/delete views], [validation], [list with filters], [pytest CRUD]
- US05 → [queries for MTD, by-category], [chart view], [empty state], [aggregation tests]
