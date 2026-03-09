# Korean Enterprise Web Dev Learning Notes

A practical note set for a common Korean enterprise backend stack: Spring Boot, MyBatis, JSP/JSTL, jQuery, and PostgreSQL.

## 📚 Overview

| Folder | What it contains |
| --- | --- |
| [java](./java/README.md) | Java core concepts used in backend work |
| [springboot](./springboot/README.md) | Spring Boot basics for REST and layered architecture |
| [mybatis](./mybatis/README.md) | MyBatis dynamic SQL and mapper patterns |
| [sql](./sql/README.md) | SQL fundamentals for daily CRUD and reporting |
| [jsp-jstl](./jsp-jstl/README.md) | JSP/JSTL syntax and server-side rendering patterns |
| [jquery](./jquery/README.md) | jQuery and AJAX patterns used in legacy projects |
| [projects](./projects/README.md) | Project structure and reference implementation notes |

## 🧱 Stack Snapshot

| Layer | Technology |
| --- | --- |
| Language | Java 17+ |
| Framework | Spring Boot 3.x |
| Data Access | MyBatis |
| View | JSP + JSTL |
| Frontend | jQuery + Bootstrap |
| Database | PostgreSQL |
| Build | Maven |

## ✅ Why this stack is still relevant

- Spring remains a standard in many SI and public-sector environments.
- MyBatis is preferred when SQL must stay explicit and auditable.
- JSP/JSTL and jQuery are still common in maintenance-heavy systems.
- PostgreSQL is increasingly selected as a lower-cost alternative to Oracle.

## 🇰🇷 Why Korea still uses this "old" stack

| Reason | Explanation |
| --- | --- |
| 🏛️ Government locked it in | eGovFrame (전자정부 표준프레임워크) is Spring-based and mandatory for all public-sector contracts. Hundreds of thousands of systems still run on it. |
| 🏢 SI company culture | Samsung SDS, LG CNS, SK C&C win multi-year contracts (5–10 years) to build and maintain systems. Once live, stability wins over modernization. |
| 👨‍💻 Self-reinforcing developer pipeline | Academies (학원) teach this stack because job postings demand it. Companies hire those developers. The cycle repeats. |
| 🗄️ Oracle DB dependency | Many systems use Oracle with expensive long-term licenses. MyBatis handles Oracle quirks better than JPA. Switching the ORM means rewriting thousands of queries. |
| 🔒 Risk aversion in regulated industries | Banks, insurance, and government face strict compliance audits. "Proven" beats "modern" when a bug means regulatory fines. |

**The change is happening — just slowly.**
New greenfield projects increasingly use Spring Boot + JPA + Vue/React.
eGovFrame 4.0 (2022) added optional support for Spring Boot and Vue.
But legacy maintenance contracts will keep the old stack alive for another 10–15 years.

> Learn this stack to get hired now. Add JPA + React/Vue to become valuable for the next wave.

## 🗺️ Learning Path

1. Java fundamentals and SQL basics
2. Spring Boot core and REST API design
3. MyBatis dynamic SQL and mapper XML
4. JSP/JSTL and jQuery integration
5. End-to-end project implementation

## 🔎 Visual Guide

- `Java` = language foundation
- `Spring` = application framework
- `MyBatis` = SQL mapper
- `SQL` = query and data logic
- `JSP/JSTL + jQuery` = legacy-friendly UI layer

## 📝 Notes

- Content is example-driven and focused on practical patterns.
- Each folder README is self-contained for quick review.
