# 🗃️ SQL & Oracle — From Basics to Advanced

[<- Back to root](../README.md)

> This note covers standard SQL **and** Oracle-specific syntax used in Korean enterprise companies.
> Use the AI Quiz button to test yourself, and AI Tips for real-world Oracle advice.

---

## 🧱 SQL Statement Types

| Type | Purpose |
| --- | --- |
| `SELECT` | Read data |
| `INSERT` | Add data |
| `UPDATE` | Change data |
| `DELETE` | Remove data |
| `DDL` | `CREATE`, `ALTER`, `DROP` — structure |
| `TCL` | `COMMIT`, `ROLLBACK`, `SAVEPOINT` — transactions |

---

## 📐 Basic Query Shape

**PostgreSQL / MySQL:**

```sql
SELECT columns FROM table WHERE condition ORDER BY column LIMIT n OFFSET m;
```

**Oracle (no LIMIT — use ROWNUM or FETCH):**

```sql
-- Oracle 12c+ (recommended)
SELECT columns FROM table WHERE condition ORDER BY column
FETCH FIRST 10 ROWS ONLY;

-- Oracle classic (ROWNUM)
SELECT * FROM (
  SELECT * FROM users WHERE status = 'ACTIVE' ORDER BY created_at DESC
) WHERE ROWNUM <= 10;
```

> **Why Oracle is different:** Oracle doesn't have `LIMIT`. You must use `FETCH FIRST` (12c+) or `ROWNUM` subquery (legacy). Korean companies often still use the `ROWNUM` pattern.

---

## 🔎 Filtering

**How to think about WHERE:**
> The database reads every row and asks: "Does this row pass the condition?"
> Rows that pass → kept. Rows that fail → removed from result.

```sql
SELECT * FROM users WHERE status = 'ACTIVE';
-- reads all rows, keeps only where status column = 'ACTIVE'

SELECT * FROM users WHERE status = 'ACTIVE' AND age >= 18;
-- BOTH conditions must be true → fewer rows returned

SELECT * FROM users WHERE status = 'ACTIVE' OR status = 'PENDING';
-- EITHER condition is true → more rows returned

SELECT * FROM users WHERE id IN (1, 2, 3);
-- same as: WHERE id = 1 OR id = 2 OR id = 3, but cleaner

SELECT * FROM users WHERE age BETWEEN 18 AND 30;
-- same as: WHERE age >= 18 AND age <= 30 (inclusive on both ends)

SELECT * FROM users WHERE username LIKE '%john%';
-- % means "any characters here" — finds 'john', 'johnny', 'bigJohn', 'johnsmith'
```

**AND vs OR — the most common mistake:**

```sql
-- WRONG: this means status='ACTIVE' AND (age=18 OR age=25)
WHERE status = 'ACTIVE' AND age = 18 OR age = 25

-- CORRECT: use parentheses to be explicit
WHERE status = 'ACTIVE' AND (age = 18 OR age = 25)
```

Visual — how AND/OR affects row count:

```text
Full table: 100 rows
  WHERE status = 'ACTIVE'          → 60 rows  (fewer — strict)
  AND salary > 4000000             → 20 rows  (even fewer — both must match)

  WHERE status = 'ACTIVE'          → 60 rows
  OR status = 'PENDING'            → 75 rows  (more — either is fine)
```

**NULL comparison — Oracle gotcha:**

```sql
-- WRONG: this never returns any rows
WHERE phone = NULL

-- CORRECT: use IS NULL / IS NOT NULL
WHERE phone IS NULL
WHERE phone IS NOT NULL
```

> **Oracle Note:** Strings use single quotes only `'ACTIVE'`.
> Double quotes are for identifiers (column/table names with spaces).
> `WHERE status = "ACTIVE"` — this looks for a column named ACTIVE, not the string.

---

## 📄 Pagination — Oracle Style

**What pagination means:**
> Instead of returning 10,000 rows at once, you return page by page.
> Page 1 = rows 1–10, Page 2 = rows 11–20, Page 3 = rows 21–30, etc.

```sql
-- Oracle 12c+ (clean modern way)
SELECT employee_id, name, salary
FROM employees
ORDER BY employee_id
OFFSET 20 ROWS FETCH NEXT 10 ROWS ONLY;
-- OFFSET 20 = skip the first 20 rows (that's page 1 and 2)
-- FETCH NEXT 10 = take the next 10 rows (that's page 3)
```

**Oracle legacy (used in most Korean companies) — why 3 layers?**

```sql
SELECT *
FROM (
  -- Layer 3 (outermost): filter by row number range
  SELECT a.*, ROWNUM AS rn
  FROM (
    -- Layer 2 (middle): assign ROWNUM AFTER ordering
    SELECT employee_id, name, salary
    FROM employees
    ORDER BY employee_id
    -- Layer 1 (innermost): the actual data + sort
  ) a
  WHERE ROWNUM <= 30   -- end row: page 3 with 10 per page → 30
)
WHERE rn >= 21;        -- start row: page 3 starts at row 21
```

**Why 3 layers? — The critical reason:**
> `ROWNUM` is assigned BEFORE `ORDER BY` is applied.
> If you write `WHERE ROWNUM <= 10` directly, Oracle numbers rows randomly before sorting.
> The innermost subquery sorts first, then the middle layer assigns ROWNUM correctly.

**Page formula:**

```text
start = (page - 1) * size + 1
end   = page * size

Page 1, 10 per page: start=1,  end=10   → ROWNUM <= 10,  rn >= 1
Page 2, 10 per page: start=11, end=20   → ROWNUM <= 20,  rn >= 11
Page 3, 10 per page: start=21, end=30   → ROWNUM <= 30,  rn >= 21
```

---

## ✍️ Write Operations

```sql
-- INSERT (same in Oracle)
INSERT INTO users (username, email, status)
VALUES ('john', 'john@test.com', 'ACTIVE');

-- Oracle: must COMMIT to save permanently
COMMIT;

-- UPDATE
UPDATE users SET status = 'INACTIVE' WHERE id = 1;
COMMIT;

-- DELETE
DELETE FROM users WHERE id = 1;
COMMIT;

-- ROLLBACK (undo uncommitted changes)
ROLLBACK;
```

> **Important:** Oracle does NOT auto-commit. Every `INSERT`, `UPDATE`, `DELETE` must be followed by `COMMIT` or it will be lost when the session closes.

---

## 🔗 JOINs

**What a JOIN does:**
> A JOIN connects two tables by matching rows where a condition is true.
> You always specify: **which tables** and **what key connects them**.

**Mental model — think of two lists:**

```text
users table          orders table
-----------          ------------
id | name            order_id | user_id | amount
1  | Kim             1        | 1       | 50000
2  | Lee             2        | 1       | 30000
3  | Park            3        | 2       | 20000
                     (no order for user 3)
```

**INNER JOIN — only rows that match on BOTH sides:**

```sql
SELECT u.name, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

-- Result: Kim/50000, Kim/30000, Lee/20000
-- Park is excluded because he has no order
-- Think: "Give me users AND their orders — skip anyone with no order"
```

**LEFT JOIN — all rows from the LEFT table, matching or not:**

```sql
SELECT u.name, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;

-- Result: Kim/50000, Kim/30000, Lee/20000, Park/NULL
-- Park appears with NULL amount — he has no order but is still shown
-- Think: "Give me ALL users, and attach order data if it exists"
```

**Visual diagram:**

```text
INNER JOIN              LEFT JOIN
  users ∩ orders          all users + matching orders

  [users] [orders]        [  users  ][orders]
       [■■■]                   [■■■■■■■]
    only overlap            all of left + overlap
```

**When to use which:**

```text
INNER JOIN → when you only care about rows with related data
             e.g., "show me all orders with customer name"

LEFT JOIN  → when you need ALL rows from the main table
             e.g., "show me all employees, even those with no sales"
             e.g., "find employees who have NO orders" (WHERE o.id IS NULL)
```

**Find rows with NO match (LEFT JOIN + NULL check):**

```sql
-- Employees who have never made any orders
SELECT e.name
FROM employees e
LEFT JOIN orders o ON e.id = o.employee_id
WHERE o.order_id IS NULL;  -- ← NULL means no matching order found
```

**Oracle old syntax — you will see this in company code:**

```sql
-- Old INNER JOIN (comma syntax)
SELECT u.username, o.amount
FROM users u, orders o
WHERE u.id = o.user_id;   -- join condition goes in WHERE

-- Old LEFT JOIN (+ sign on the optional side)
SELECT u.username, o.amount
FROM users u, orders o
WHERE u.id = o.user_id(+);  -- (+) means "this side can be NULL/missing"
-- The (+) goes on the table that may have no match (like RIGHT side of LEFT JOIN)
```

> **Korean company tip:** Legacy Oracle code uses `(+)` everywhere.
> When reading: `(+)` on orders side = LEFT JOIN keeping all users.
> Write new code with standard `LEFT JOIN` — it is clearer and safer.

---

## 📊 Aggregation

**What GROUP BY does — mental model:**
> GROUP BY collapses many rows into one row per group, then applies a calculation.
> Think of it like sorting items into buckets, then counting/summing each bucket.

```text
Before GROUP BY:             After GROUP BY status:
employee | status            status   | COUNT(*)
---------|--------           ---------|--------
Kim      | ACTIVE            ACTIVE   | 3
Lee      | ACTIVE            INACTIVE | 1
Park     | ACTIVE
Choi     | INACTIVE
```

```sql
-- Count employees per status
SELECT status, COUNT(*) AS cnt
FROM employees
GROUP BY status;

-- Average salary per department
SELECT department_id, AVG(salary) AS avg_sal
FROM employees
GROUP BY department_id;

-- Multiple group columns
SELECT department_id, status, COUNT(*) AS cnt
FROM employees
GROUP BY department_id, status;
-- Groups into: dept10/ACTIVE, dept10/INACTIVE, dept20/ACTIVE, etc.
```

**WHERE vs HAVING — the most confused rule:**

```text
WHERE  → filters ROWS before grouping   (works on individual row data)
HAVING → filters GROUPS after grouping  (works on aggregated results)
```

```sql
-- WHERE: filter rows BEFORE grouping
SELECT department_id, COUNT(*) AS cnt
FROM employees
WHERE status = 'ACTIVE'        -- ← remove inactive rows first
GROUP BY department_id;

-- HAVING: filter groups AFTER grouping
SELECT department_id, COUNT(*) AS cnt
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 2;          -- ← keep only departments with 2+ employees

-- Both together
SELECT department_id, AVG(salary) AS avg_sal
FROM employees
WHERE status = 'ACTIVE'        -- ← step 1: only active employees
GROUP BY department_id
HAVING AVG(salary) > 4000000;  -- ← step 2: only high-salary departments
```

**Common mistake — selecting non-grouped columns:**

```sql
-- WRONG: name is not in GROUP BY and not aggregated
SELECT department_id, name, COUNT(*)
FROM employees
GROUP BY department_id;    -- ← Oracle error: name must be in GROUP BY or aggregated

-- CORRECT option 1: add name to GROUP BY
SELECT department_id, name, COUNT(*)
FROM employees
GROUP BY department_id, name;

-- CORRECT option 2: aggregate name
SELECT department_id, MAX(name), COUNT(*)
FROM employees
GROUP BY department_id;
```

| Function | Meaning | Example result |
| --- | --- | --- |
| `COUNT(*)` | Count all rows | 5 |
| `COUNT(col)` | Count non-NULL values only | 4 (if 1 is NULL) |
| `SUM(col)` | Total sum | 15000000 |
| `AVG(col)` | Average | 3000000 |
| `MAX(col)` | Highest value | 5200000 |
| `MIN(col)` | Lowest value | 2800000 |
| `LISTAGG(col, ',')` | Oracle: join values into one string | 'Kim, Lee, Park' |

```sql
-- Oracle LISTAGG: combine multiple rows into one string
SELECT department_id,
       LISTAGG(name, ', ') WITHIN GROUP (ORDER BY name) AS members
FROM employees
GROUP BY department_id;
```

---

## 🏗️ Oracle Sequences (Auto-increment)

Oracle has no `AUTO_INCREMENT`. It uses **sequences**.

```sql
-- Create a sequence
CREATE SEQUENCE seq_users
  START WITH 1
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Use in INSERT
INSERT INTO users (id, username, email)
VALUES (seq_users.NEXTVAL, 'john', 'john@test.com');

-- Get current value (after using NEXTVAL)
SELECT seq_users.CURRVAL FROM DUAL;
```

> **DUAL** is Oracle's built-in dummy table — used when you need to SELECT something without a real table.

---

## 🔢 Oracle Functions

### String Functions

```sql
SELECT UPPER('hello')            FROM DUAL;  -- HELLO
SELECT LOWER('HELLO')            FROM DUAL;  -- hello
SELECT SUBSTR('Hello World', 1, 5) FROM DUAL; -- Hello
SELECT LENGTH('Hello')           FROM DUAL;  -- 5
SELECT TRIM('  hello  ')         FROM DUAL;  -- hello
SELECT REPLACE('Hi Java', 'Java', 'Oracle') FROM DUAL; -- Hi Oracle
SELECT LPAD('5', 4, '0')         FROM DUAL;  -- 0005
SELECT RPAD('5', 4, '0')         FROM DUAL;  -- 5000
SELECT INSTR('Hello World', 'World') FROM DUAL; -- 7
```

### Number Functions

```sql
SELECT ROUND(3.567, 2)  FROM DUAL;  -- 3.57
SELECT TRUNC(3.567, 2)  FROM DUAL;  -- 3.56 (no rounding)
SELECT MOD(10, 3)        FROM DUAL;  -- 1
SELECT ABS(-5)           FROM DUAL;  -- 5
SELECT CEIL(4.1)         FROM DUAL;  -- 5
SELECT FLOOR(4.9)        FROM DUAL;  -- 4
```

### Date Functions

```sql
SELECT SYSDATE              FROM DUAL;  -- current date+time
SELECT TRUNC(SYSDATE)       FROM DUAL;  -- today midnight
SELECT ADD_MONTHS(SYSDATE, 3) FROM DUAL; -- 3 months later
SELECT MONTHS_BETWEEN(SYSDATE, hire_date) FROM employees; -- months diff
SELECT TO_DATE('2026-03-16', 'YYYY-MM-DD') FROM DUAL; -- string to date
SELECT TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') FROM DUAL; -- date to string
```

---

## 🔄 NULL Handling

**What NULL means:**
> NULL means "unknown" or "no value" — it is NOT zero and NOT empty string.
> Any comparison with NULL returns UNKNOWN, not TRUE or FALSE.
> That is why `WHERE phone = NULL` never works — you must use `IS NULL`.

```sql
-- NVL(value, default): if value is NULL, return default instead
SELECT NVL(phone, 'N/A') FROM users;
-- phone = '010-1234' → '010-1234'
-- phone = NULL      → 'N/A'

-- NVL2(value, if_not_null, if_null): branch based on NULL
SELECT NVL2(phone, 'Has phone', 'No phone') FROM users;
-- phone has value → 'Has phone'
-- phone is NULL   → 'No phone'

-- NULLIF(a, b): return NULL if a equals b, else return a
-- Use case: avoid division by zero
SELECT salary / NULLIF(work_days, 0) AS daily_salary FROM employees;
-- work_days = 0 → NULLIF returns NULL → division becomes NULL (safe, no error)
-- work_days = 20 → NULLIF returns 20 → normal division

-- COALESCE(a, b, c, ...): return the FIRST non-NULL value in the list
SELECT COALESCE(mobile, phone, office_phone, 'No contact') FROM users;
-- checks mobile first, then phone, then office_phone
-- returns the first one that is not NULL
-- if all are NULL → returns 'No contact'
```

**NULL in aggregation:**

```sql
-- COUNT(*) counts all rows including NULLs
-- COUNT(col) counts only non-NULL values in that column
SELECT COUNT(*)       FROM employees;  -- 10 (all rows)
SELECT COUNT(phone)   FROM employees;  -- 7  (only 7 have a phone)

-- SUM, AVG, MAX, MIN all ignore NULL automatically
SELECT AVG(bonus) FROM employees;  -- calculates average only on non-NULL bonus values
```

---

## 🔀 CASE Expression

**What CASE does:**
> CASE is SQL's if/else. It checks conditions row by row and returns a value.
> Always ends with `END`. `ELSE` is optional — without it, unmatched rows return NULL.

**Simple CASE — compare one column to fixed values:**

```sql
-- Like a switch statement: check status against known values
SELECT name,
  CASE status
    WHEN 'ACTIVE'   THEN 'Active'     -- if status = 'ACTIVE'  → 'Active'
    WHEN 'INACTIVE' THEN 'Inactive'   -- if status = 'INACTIVE' → 'Inactive'
    ELSE 'Unknown'                    -- anything else → 'Unknown'
  END AS status_label
FROM users;
```

**Searched CASE — use any condition (more powerful):**

```sql
-- Like if/else if: each WHEN is a full condition
SELECT name, salary,
  CASE
    WHEN salary >= 5000000 THEN 'Senior'   -- checks top-down, first match wins
    WHEN salary >= 3000000 THEN 'Mid'      -- only reached if salary < 5000000
    WHEN salary >= 1000000 THEN 'Junior'   -- only reached if salary < 3000000
    ELSE 'Intern'                          -- everything else
  END AS level
FROM employees;

-- Important: conditions are checked TOP to BOTTOM — first match wins
-- So put the most restrictive condition FIRST
```

**CASE inside aggregation — very common in Korean reports:**

```sql
-- Count active and inactive separately in ONE query
SELECT
  COUNT(CASE WHEN status = 'ACTIVE'   THEN 1 END) AS active_count,
  COUNT(CASE WHEN status = 'INACTIVE' THEN 1 END) AS inactive_count,
  COUNT(*) AS total_count
FROM employees;

-- Sum salary by department level in one row
SELECT
  SUM(CASE WHEN department_id = 10 THEN salary ELSE 0 END) AS dept10_salary,
  SUM(CASE WHEN department_id = 20 THEN salary ELSE 0 END) AS dept20_salary
FROM employees;
-- This is a manual PIVOT — very common in Korean company reports
```

---

## 🪟 Window Functions (Analytic Functions in Oracle)

Window functions are used heavily in Korean enterprise reports.

**What is a window function?**
> A regular aggregate (`SUM`, `AVG`, `COUNT`) **collapses** rows into one result per group.
> A window function **adds a new column** to each row without collapsing anything.
> Think of it as: "for each row, look out a *window* of related rows and compute something."

**The OVER() clause is what makes it a window function:**

```text
FUNCTION() OVER (PARTITION BY ... ORDER BY ... ROWS/RANGE ...)
               └─ defines the "window" of rows this function can see
```

**PARTITION BY vs GROUP BY:**

| Feature | GROUP BY | PARTITION BY (in window) |
| --- | --- | --- |
| Output | One row per group | Same number of rows as input |
| Use case | Summary/totals | Per-row calculation with group context |

**Visual example — salary ranking within each department:**

```text
employees table:          After ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC):
dept  name    salary      dept  name    salary  rank_in_dept
----  ------  ------      ----  ------  ------  ------------
A     Alice   5000        A     Alice   5000    1   <- highest in dept A
A     Bob     4000        A     Bob     4000    2
A     Carol   4000        A     Carol   4000    3   <- ROW_NUMBER always unique
B     Dave    6000        B     Dave    6000    1   <- partition resets for dept B
B     Eve     5500        B     Eve     5500    2
```

**ROW_NUMBER vs RANK vs DENSE_RANK — when salaries tie:**

```text
salary  ROW_NUMBER  RANK  DENSE_RANK
------  ----------  ----  ----------
6000    1           1     1
5000    2           2     2
5000    3           2     2   <- same rank (tie)
4000    4           4     3   <- RANK skips 3, DENSE_RANK doesn't skip
4000    5           4     3
```

- **ROW_NUMBER** — always unique, arbitrary tiebreak → use when you need exactly 1 result per group
- **RANK** — ties get same number, next rank skips → like sports ranking (1st, 2nd, 2nd, 4th)
- **DENSE_RANK** — ties get same number, no skip → use for "top N salary levels"

```sql
-- ROW_NUMBER: assign unique row numbers per group
SELECT
  employee_id,
  department_id,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rank_in_dept
FROM employees;

-- RANK: same salary = same rank, then gap
SELECT name, salary,
  RANK() OVER (ORDER BY salary DESC) AS salary_rank
FROM employees;

-- DENSE_RANK: same salary = same rank, no gap
SELECT name, salary,
  DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank
FROM employees;
```

**Practical use — get top 1 employee per department (common interview question):**

```sql
-- Step 1: rank employees within each department
WITH ranked AS (
  SELECT
    employee_id, name, department_id, salary,
    ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rn
  FROM employees
)
-- Step 2: keep only rank 1
SELECT employee_id, name, department_id, salary
FROM ranked
WHERE rn = 1;
```

> You **cannot** do `WHERE ROW_NUMBER() OVER(...) = 1` directly — window functions cannot appear in WHERE.
> The CTE/subquery trick is the standard solution.

**Running totals — SUM with a window:**

```sql
-- SUM with running total
SELECT
  employee_id,
  salary,
  SUM(salary) OVER (ORDER BY employee_id) AS running_total
FROM employees;
```

> Each row's `running_total` = sum of salary from row 1 up to current row.
> This is impossible with GROUP BY because GROUP BY would collapse everything into one row.

**LAG/LEAD — look at the previous or next row:**

```sql
-- LAG/LEAD: access previous/next row
SELECT
  employee_id,
  salary,
  LAG(salary, 1, 0) OVER (ORDER BY employee_id)  AS prev_salary,
  LEAD(salary, 1, 0) OVER (ORDER BY employee_id) AS next_salary
FROM employees;
```

> `LAG(col, n, default)` — look back n rows. If no row exists (first row), use default.
> `LEAD(col, n, default)` — look forward n rows. If no row exists (last row), use default.
> **Use case:** monthly sales comparison — how does this month compare to last month?

```sql
-- Month-over-month comparison pattern
SELECT
  month,
  sales,
  LAG(sales) OVER (ORDER BY month) AS prev_month_sales,
  sales - LAG(sales, 1, 0) OVER (ORDER BY month) AS change
FROM monthly_sales;
```

---

## 🔄 Subqueries

**What is a subquery?**
> A subquery is a SELECT inside another SELECT. The inner query runs first and its result is used by the outer query.
> Think of it as: "I need to know X first, then use X to filter or calculate Y."

**Three types — know when to use each:**

| Type | Returns | Where it appears | Performance |
| --- | --- | --- | --- |
| Scalar | One single value | SELECT list or WHERE | OK for small tables |
| IN / NOT IN | A list of values | WHERE col IN (...) | Avoid on large tables |
| EXISTS / NOT EXISTS | True or False | WHERE EXISTS (...) | Usually fastest |
| Correlated | One value per row | WHERE, SELECT | Re-runs for every row |

**Scalar subquery — one value in the SELECT list:**

```sql
-- Scalar subquery (returns one value)
SELECT name,
  (SELECT department_name FROM departments WHERE id = e.department_id) AS dept
FROM employees e;
```

> The inner query runs once per row of `employees`.
> It must return exactly ONE value — if it returns multiple rows, Oracle throws an error.
> Good for: adding a single lookup value per row without a JOIN.
> Watch out: can be slow on large tables (runs N times, once per employee row).

**IN subquery — match against a list:**

```sql
-- IN subquery
SELECT * FROM employees
WHERE department_id IN (
  SELECT id FROM departments WHERE location = 'Seoul'
);
```

> The inner query runs ONCE and produces a list: e.g., (10, 20, 30).
> The outer query then filters: `WHERE department_id IN (10, 20, 30)`.
> **Gotcha with NULL:** If the subquery returns any NULL, `NOT IN` will return NO rows.
> That is why `NOT EXISTS` is safer than `NOT IN` when NULLs are possible.

**EXISTS — checks if at least one matching row exists:**

```sql
-- EXISTS (faster than IN for large data)
SELECT * FROM employees e
WHERE EXISTS (
  SELECT 1 FROM departments d
  WHERE d.id = e.department_id AND d.location = 'Seoul'
);
```

> `EXISTS` does NOT need the inner query to return any real data — just `SELECT 1` is enough.
> It stops as soon as it finds the FIRST matching row (short-circuit evaluation).
> This makes it faster than `IN` when the subquery result set is large.
> **Rule of thumb:** Use `EXISTS` when checking "does at least one related row exist?"

**NOT EXISTS — find rows with NO match (very common pattern):**

```sql
-- Find employees who have NO orders at all
SELECT e.name
FROM employees e
WHERE NOT EXISTS (
  SELECT 1 FROM orders o
  WHERE o.employee_id = e.employee_id
);
```

> This is safer than `NOT IN` because it handles NULLs correctly.
> If `orders.employee_id` has any NULL, `NOT IN` breaks. `NOT EXISTS` is unaffected.

**Correlated subquery — runs once per outer row:**

```sql
-- Correlated subquery
SELECT * FROM employees e
WHERE salary > (
  SELECT AVG(salary) FROM employees
  WHERE department_id = e.department_id  -- ← references the outer query's e
);
```

> The key is `e.department_id` — it references the OUTER query's current row.
> For each employee row in the outer query, the inner query re-runs with that employee's department.
> This means: "find employees earning more than their OWN department's average" — not the company average.
> Performance: runs N times (once per outer row) — use a CTE or derived table for better performance on large data.

---

## 📋 WITH Clause (CTE — Common Table Expression)

```sql
-- Cleaner alternative to nested subqueries
WITH dept_avg AS (
  SELECT department_id, AVG(salary) AS avg_sal
  FROM employees
  GROUP BY department_id
),
high_earners AS (
  SELECT e.name, e.salary, d.avg_sal
  FROM employees e
  JOIN dept_avg d ON e.department_id = d.department_id
  WHERE e.salary > d.avg_sal
)
SELECT * FROM high_earners ORDER BY salary DESC;
```

---

## 🧠 Execution Order

```text
FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → FETCH/ROWNUM
```

---

## 🏃 Performance & Indexes

```sql
-- Create index (speeds up WHERE/JOIN on this column)
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_emp_dept ON employees(department_id, salary);

-- Unique index
CREATE UNIQUE INDEX idx_users_email ON users(email);

-- Check execution plan in Oracle
EXPLAIN PLAN FOR
SELECT * FROM employees WHERE department_id = 10;
SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);

-- Common performance tips:
-- 1. Avoid SELECT * in production
-- 2. Avoid functions on indexed columns in WHERE
--    BAD:  WHERE TO_CHAR(hire_date, 'YYYY') = '2024'
--    GOOD: WHERE hire_date >= DATE '2024-01-01' AND hire_date < DATE '2025-01-01'
-- 3. Use EXISTS instead of IN for large subqueries
-- 4. Add indexes on foreign key columns
```

---

## 🔐 Oracle Transactions

```sql
-- Full transaction example
BEGIN
  INSERT INTO orders (id, user_id, amount) VALUES (seq_orders.NEXTVAL, 1, 50000);
  UPDATE users SET order_count = order_count + 1 WHERE id = 1;
  COMMIT;  -- save both changes
EXCEPTION
  WHEN OTHERS THEN
    ROLLBACK;  -- undo both if anything fails
    RAISE;
END;

-- SAVEPOINT: partial rollback
SAVEPOINT before_update;
UPDATE employees SET salary = salary * 1.1;
-- Oops, wrong update
ROLLBACK TO before_update;
COMMIT;
```

---

## 📝 DDL — Table Structure

```sql
-- Create table
CREATE TABLE employees (
  employee_id  NUMBER        PRIMARY KEY,
  name         VARCHAR2(100) NOT NULL,
  email        VARCHAR2(150) UNIQUE,
  department_id NUMBER,
  salary       NUMBER(10, 2) DEFAULT 0,
  hire_date    DATE          DEFAULT SYSDATE,
  status       VARCHAR2(20)  DEFAULT 'ACTIVE',
  CONSTRAINT fk_dept FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Add column
ALTER TABLE employees ADD phone VARCHAR2(20);

-- Modify column
ALTER TABLE employees MODIFY name VARCHAR2(200);

-- Drop column
ALTER TABLE employees DROP COLUMN phone;

-- Rename table
RENAME employees TO staff;
```

---

## 🏋️ Practice Exercises

> Try these with Oracle SQL Developer or online tools like [livesql.oracle.com](https://livesql.oracle.com) (free, no install).

### Level 1 — Basic

```sql
-- 1. Find all employees with salary > 3,000,000
-- 2. Count employees per department
-- 3. Find employees hired in 2025
-- 4. List top 5 highest paid employees
-- 5. Find employees whose name starts with 'K'
```

### Level 2 — Intermediate

```sql
-- 1. Find departments where avg salary > 4,000,000
-- 2. List employees with no phone number (NULL)
-- 3. Find employees earning more than their department average
-- 4. Get second highest salary in each department
-- 5. Paginate employees: show page 3 (10 per page)
```

### Level 3 — Advanced

```sql
-- 1. Use a CTE to find top 3 earners per department
-- 2. Use LISTAGG to show all employee names per department in one row
-- 3. Calculate running salary total ordered by hire date
-- 4. Use LAG to show each employee's salary vs their previous hire
-- 5. Write a transaction that transfers budget between two departments safely
```

---

## 🆚 PostgreSQL vs Oracle Quick Comparison

| Feature | PostgreSQL | Oracle |
| --- | --- | --- |
| Auto-increment | `SERIAL` / `GENERATED` | Sequence + trigger |
| Pagination | `LIMIT 10 OFFSET 20` | `FETCH NEXT 10 ROWS ONLY` |
| String concat | `\|\|` or `CONCAT()` | `\|\|` or `CONCAT()` |
| Current time | `NOW()` | `SYSDATE` |
| NULL replace | `COALESCE()` | `NVL()` or `COALESCE()` |
| Auto-commit | Yes | **No — must COMMIT** |
| Dummy table | Not needed | `FROM DUAL` |
| Regex | `~` operator | `REGEXP_LIKE()` |
| Top N rows | `LIMIT n` | `FETCH FIRST n ROWS ONLY` |

---

## 🧱 Oracle Basics You Must Know At Work

If your company uses Oracle, these are not optional:

1. Read `SELECT`, `JOIN`, `GROUP BY`, subquery, and pagination quickly.
2. Understand Oracle data types and date handling.
3. Be comfortable reading old SQL with `ROWNUM`, `(+)`, `NVL`, and `DECODE`.
4. Know when to `COMMIT`, `ROLLBACK`, and how to check execution plans.
5. Be able to debug SQL inside MyBatis XML or legacy mapper files.

### Oracle data types

```sql
VARCHAR2(100)     -- variable-length string
CHAR(1)           -- fixed-length string
NUMBER            -- integer or decimal
NUMBER(10, 2)     -- precision 10, scale 2
DATE              -- date + time in Oracle
TIMESTAMP         -- more precise date/time
CLOB              -- large text
BLOB              -- binary data
```

> Oracle `DATE` already includes time. Many beginners assume it only stores the date part.

### `VARCHAR2` vs `CHAR`

```sql
-- Better for most business columns
username VARCHAR2(100)

-- Use only for fixed-size values like Y/N, status flags, code type
use_yn   CHAR(1)
```

> In company code, `CHAR(1)` is common for flags like `Y/N`, but `VARCHAR2` is better for names, titles, and variable text.

---

## 🧰 Oracle Features Common In Real Projects

### `MERGE` for upsert

Oracle projects often use `MERGE` instead of separate `SELECT + INSERT/UPDATE`.

```sql
MERGE INTO users t
USING (
  SELECT 1001 AS user_id, 'Kim' AS username FROM DUAL
) s
ON (t.user_id = s.user_id)
WHEN MATCHED THEN
  UPDATE SET t.username = s.username
WHEN NOT MATCHED THEN
  INSERT (user_id, username)
  VALUES (s.user_id, s.username);
```

### `DECODE` in legacy code

```sql
SELECT username,
       DECODE(use_yn, 'Y', 'Use', 'N', 'Not Use', 'Unknown') AS use_label
FROM users;
```

> Prefer `CASE` in new SQL, but you must be able to read `DECODE`.

### `REGEXP_LIKE`

```sql
SELECT *
FROM users
WHERE REGEXP_LIKE(email, '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
```

### Hierarchical query

Used in menu trees, organization trees, category trees.

```sql
SELECT menu_id,
       parent_menu_id,
       menu_nm,
       LEVEL
FROM menu
START WITH parent_menu_id IS NULL
CONNECT BY PRIOR menu_id = parent_menu_id
ORDER SIBLINGS BY sort_ord;
```

### `PIVOT`

```sql
SELECT *
FROM (
  SELECT department_id, status, cnt
  FROM dept_status_summary
)
PIVOT (
  SUM(cnt)
  FOR status IN ('ACTIVE' AS active_cnt, 'INACTIVE' AS inactive_cnt)
);
```

---

## ⚙️ PL/SQL Basics

In many Oracle companies, SQL alone is not enough. You should also read basic PL/SQL.

### Anonymous block

```sql
DECLARE
  v_user_cnt NUMBER;
BEGIN
  SELECT COUNT(*)
    INTO v_user_cnt
    FROM users
   WHERE use_yn = 'Y';

  DBMS_OUTPUT.PUT_LINE('Active users: ' || v_user_cnt);
END;
```

### Procedure

```sql
CREATE OR REPLACE PROCEDURE pr_update_salary (
  p_emp_id IN employees.employee_id%TYPE,
  p_raise  IN NUMBER
) IS
BEGIN
  UPDATE employees
     SET salary = salary + p_raise
   WHERE employee_id = p_emp_id;

  COMMIT;
END;
```

### Function

```sql
CREATE OR REPLACE FUNCTION fn_get_dept_name (
  p_dept_id IN departments.id%TYPE
) RETURN VARCHAR2
IS
  v_dept_name departments.department_name%TYPE;
BEGIN
  SELECT department_name
    INTO v_dept_name
    FROM departments
   WHERE id = p_dept_id;

  RETURN v_dept_name;
END;
```

### Trigger

```sql
CREATE OR REPLACE TRIGGER trg_users_bi
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF :NEW.id IS NULL THEN
    :NEW.id := seq_users.NEXTVAL;
  END IF;
END;
```

> You do not need to master advanced PL/SQL immediately, but you must recognize `DECLARE`, `BEGIN`, `EXCEPTION`, `END`, `:NEW`, and `:OLD`.

---

## 🩺 How To Read And Debug Company SQL

When you see a hard SQL query in your company, use this order:

1. Identify the main table in `FROM`.
2. Mark each `JOIN` and what key connects it.
3. Separate filter logic in `WHERE`.
4. Check aggregation: `GROUP BY`, `HAVING`, analytic functions.
5. Check pagination or top-N logic.
6. Check Oracle-only parts: `NVL`, `DECODE`, `ROWNUM`, `MERGE`, `CONNECT BY`.
7. Run subqueries separately until each part is understandable.

### Debug workflow

```sql
-- Step 1: run base rows only
SELECT *
FROM employees e
WHERE e.department_id = 10;

-- Step 2: add joins
SELECT e.employee_id, e.name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.id
WHERE e.department_id = 10;

-- Step 3: add aggregation or window functions later
```

### Performance workflow

```sql
EXPLAIN PLAN FOR
SELECT e.employee_id, e.name
FROM employees e
WHERE e.department_id = 10;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
```

Check:

- Is Oracle doing `TABLE ACCESS FULL`?
- Is the join order reasonable?
- Is the expected index being used?
- Are there functions on indexed columns?
- Is the filter selective enough?

---

## 🧪 Practice Schema You Should Build Yourself

Practice with a small schema that looks like real company work:

```sql
departments(
  id,
  department_name,
  location
)

employees(
  employee_id,
  department_id,
  name,
  job_title,
  salary,
  hire_date,
  use_yn
)

orders(
  order_id,
  customer_id,
  order_date,
  amount,
  order_status
)

board_posts(
  post_id,
  title,
  writer_id,
  reg_dt,
  use_yn
)
```

With this schema, practice:

- CRUD
- joins
- pagination
- ranking
- aggregates
- monthly reports
- active/inactive filtering
- insert with sequence
- update with transaction

---

## 📈 4-Stage SQL Improvement Plan

### Stage 1 — Basic query control

Master these first:

- `SELECT`, `WHERE`, `ORDER BY`
- `INSERT`, `UPDATE`, `DELETE`
- `COMMIT`, `ROLLBACK`
- `JOIN`
- `GROUP BY`, `HAVING`
- `NVL`, `CASE`, date formatting

### Stage 2 — Real company SQL

Then move to:

- pagination with `ROWNUM` and `FETCH`
- scalar subquery and correlated subquery
- `EXISTS`
- `LISTAGG`
- `MERGE`
- old Oracle join syntax `(+)`

### Stage 3 — Reporting and optimization

- `ROW_NUMBER`, `RANK`, `DENSE_RANK`
- running totals
- `LAG`, `LEAD`
- explain plan
- index strategy
- date range performance

### Stage 4 — Database-side programming

- PL/SQL block
- procedure
- function
- trigger
- exception handling

---

## 🏋️ Extra Practice Tasks

### Business-style exercises

1. Write employee search SQL with optional filters:
   - department
   - salary range
   - hire date range
   - use_yn

2. Build a board list query with:
   - search keyword
   - writer filter
   - date filter
   - Oracle pagination

3. Build a monthly sales report:
   - month
   - order count
   - total amount
   - average amount
   - rank by month

4. Rewrite old Oracle SQL:
   - change `(+)` join syntax to ANSI `LEFT JOIN`
   - change `DECODE` to `CASE`
   - change nested `ROWNUM` paging to `FETCH/OFFSET`

5. Optimize a slow query:
   - identify full scan
   - propose index
   - remove function on indexed column
   - compare plan before/after

### Query writing drills

Practice these every day:

- top 1 / top N
- second highest salary
- latest row per group
- duplicate detection
- missing child rows
- running total
- previous row compare
- monthly aggregation
- null handling
- conditional label mapping

---

## 🤖 Use AI To Improve Faster

You asked whether AI or another method can help you improve. Yes, but use AI as a reviewer, not as a shortcut.

### Best AI workflow

1. Write the SQL yourself first.
2. Ask AI to review correctness.
3. Ask AI to optimize it.
4. Ask AI to rewrite it in Oracle style.
5. Ask AI to generate edge cases and test data.

### Good prompts

```text
I wrote this SQL for Oracle. Review it like a senior DBA.
Check correctness, performance, and readability.
Explain what is weak and show a better version.
```

```text
Convert this PostgreSQL query into Oracle SQL.
Use company-style Oracle patterns, including pagination if needed.
Explain every Oracle-specific change.
```

```text
Give me 5 Oracle SQL practice questions based on joins, subqueries, and window functions.
Then quiz me one by one without giving the answer first.
```

```text
Here is a slow Oracle query and its execution plan.
Find likely bottlenecks and suggest indexes or query rewrites.
```

### What AI should help you with

- converting SQL between DBs
- explaining legacy Oracle syntax
- generating practice questions
- reviewing execution plans
- building test data sets
- turning business requirements into SQL tasks

### What AI should NOT replace

- your own first attempt
- manual reading of execution plans
- understanding join direction and cardinality
- transaction logic

---

## 🧩 SQLBolt-Style Practice Track

I checked the structure of SQLBolt and the useful part is this:

- one small concept
- one short goal
- one focused exercise
- then move to the next concept

So below is an original practice track in that style, but adapted for your Oracle/company use case.

Use these with:

- Oracle Live SQL
- SQL Developer
- DBeaver
- your company test DB

### Practice schema

Create these tables first for practice:

```sql
CREATE TABLE departments (
  department_id   NUMBER PRIMARY KEY,
  department_name VARCHAR2(100) NOT NULL,
  location        VARCHAR2(100)
);

CREATE TABLE employees (
  employee_id     NUMBER PRIMARY KEY,
  department_id   NUMBER,
  employee_name   VARCHAR2(100) NOT NULL,
  job_title       VARCHAR2(100),
  salary          NUMBER(10, 2),
  hire_date       DATE,
  use_yn          CHAR(1) DEFAULT 'Y',
  CONSTRAINT fk_emp_dept
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE orders (
  order_id        NUMBER PRIMARY KEY,
  customer_name   VARCHAR2(100) NOT NULL,
  employee_id     NUMBER,
  order_amount    NUMBER(10, 2),
  order_status    VARCHAR2(30),
  order_date      DATE,
  CONSTRAINT fk_order_emp
    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
```

Add sample data:

```sql
INSERT INTO departments VALUES (10, 'Development', 'Seoul');
INSERT INTO departments VALUES (20, 'Infra', 'Busan');
INSERT INTO departments VALUES (30, 'HR', 'Seoul');

INSERT INTO employees VALUES (1001, 10, 'Kim Minsu',  'Backend Developer', 4200000, DATE '2024-01-15', 'Y');
INSERT INTO employees VALUES (1002, 10, 'Lee Jiyoon', 'Frontend Developer', 3900000, DATE '2024-03-10', 'Y');
INSERT INTO employees VALUES (1003, 20, 'Park Junho', 'DBA',                5200000, DATE '2023-11-01', 'Y');
INSERT INTO employees VALUES (1004, 30, 'Choi Ara',   'HR Manager',         3500000, DATE '2022-06-01', 'N');
INSERT INTO employees VALUES (1005, 20, 'Han Sujin',  'System Engineer',    4600000, DATE '2025-01-05', 'Y');

INSERT INTO orders VALUES (1, 'Alpha Corp', 1001, 1200000, 'DONE',    DATE '2025-01-03');
INSERT INTO orders VALUES (2, 'Beta Inc',   1001,  800000, 'DONE',    DATE '2025-01-10');
INSERT INTO orders VALUES (3, 'Gamma Ltd',  1002, 1500000, 'PENDING', DATE '2025-01-11');
INSERT INTO orders VALUES (4, 'Delta Co',   1003, 3000000, 'DONE',    DATE '2025-02-01');
INSERT INTO orders VALUES (5, 'Epsilon',    1005, 2100000, 'DONE',    DATE '2025-02-10');

COMMIT;
```

---

## 🎓 Lesson 1 — Basic SELECT

**Goal:** Return simple columns from one table.

**Exercise:** Write a query that shows:

- `employee_id`
- `employee_name`
- `salary`

from `employees`.

**Self-check:**

- Did you use `SELECT ... FROM employees`?
- Did you avoid `SELECT *`?

---

## 🎓 Lesson 2 — WHERE filter

**Goal:** Filter rows by one condition.

**Exercise:** Find all active employees only.

Expected condition:

```sql
use_yn = 'Y'
```

**Extra drill:** Find employees whose salary is greater than `4,000,000`.

---

## 🎓 Lesson 3 — Multiple conditions

**Goal:** Combine filters with `AND` and `OR`.

**Exercise:** Find active employees in department `10` whose salary is greater than `4,000,000`.

**Extra drill:** Find employees in department `10` or `20`.

---

## 🎓 Lesson 4 — Sorting

**Goal:** Control result order.

**Exercise:** List all employees ordered by salary from high to low.

**Extra drill:** Sort by:

1. `department_id` ascending
2. `salary` descending

---

## 🎓 Lesson 5 — String search

**Goal:** Use `LIKE`.

**Exercise:** Find employees whose name starts with `K`.

**Extra drill:** Find employees whose job title contains `Developer`.

---

## 🎓 Lesson 6 — Aggregate functions

**Goal:** Summarize rows.

**Exercise:** Find:

- total employee count
- average salary
- maximum salary

from `employees`.

**Extra drill:** Count only active employees.

---

## 🎓 Lesson 7 — GROUP BY

**Goal:** Summarize per group.

**Exercise:** Count employees by department.

**Extra drill:** Find average salary by department.

---

## 🎓 Lesson 8 — HAVING

**Goal:** Filter grouped results.

**Exercise:** Show departments whose average salary is greater than `4,000,000`.

**Extra drill:** Show departments with at least `2` employees.

---

## 🎓 Lesson 9 — INNER JOIN

**Goal:** Combine related tables.

**Exercise:** Show:

- employee name
- department name

for all employees.

**Extra drill:** Also include `location`.

---

## 🎓 Lesson 10 — LEFT JOIN

**Goal:** Keep rows even when related data is missing.

**Exercise:** Show all employees with their order data, even if they have no orders.

**Self-check:**

- Did you use `LEFT JOIN`?
- Did employees with no orders still appear?

---

## 🎓 Lesson 11 — Oracle NULL handling

**Goal:** Use `NVL` and `COALESCE`.

**Exercise:** Show order amount, but if it is null display `0`.

Example:

```sql
NVL(order_amount, 0)
```

**Extra drill:** Show inactive employees as `Inactive` and active ones as `Active` using `CASE`.

---

## 🎓 Lesson 12 — Date filtering

**Goal:** Filter by date safely.

**Exercise:** Find employees hired in `2024`.

**Better Oracle style:**

```sql
hire_date >= DATE '2024-01-01'
AND hire_date < DATE '2025-01-01'
```

**Why this matters:** This is better than putting a function on the date column.

---

## 🎓 Lesson 13 — Subqueries

**Goal:** Use one query inside another.

**Exercise:** Find employees whose salary is higher than the overall average salary.

**Extra drill:** Find employees whose salary is higher than their department average salary.

---

## 🎓 Lesson 14 — EXISTS

**Goal:** Use `EXISTS` for related-row checks.

**Exercise:** Find employees who have at least one order.

**Extra drill:** Find employees who have no orders.

---

## 🎓 Lesson 15 — Oracle pagination

**Goal:** Practice both modern and legacy Oracle paging.

**Exercise A — Oracle 12c+:** Show page 2 with 2 rows per page.

```sql
OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY
```

**Exercise B — legacy company style:** Write the same pagination using `ROWNUM`.

---

## 🎓 Lesson 16 — Window functions

**Goal:** Rank and compare rows.

**Exercise:** Rank employees by salary inside each department.

Use:

```sql
ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary DESC)
```

**Extra drill:** Use `RANK()` and `DENSE_RANK()` and compare the result.

---

## 🎓 Lesson 17 — Running total

**Goal:** Use analytic aggregation.

**Exercise:** Show order date, order amount, and running total of order amount.

Use:

```sql
SUM(order_amount) OVER (ORDER BY order_date)
```

---

## 🎓 Lesson 18 — Top N per group

**Goal:** Solve a common interview and company query pattern.

**Exercise:** Get the top 2 highest-paid employees in each department.

Hint:

1. use `ROW_NUMBER()`
2. wrap it in an inline view or CTE
3. filter where rank <= 2

---

## 🎓 Lesson 19 — MERGE

**Goal:** Practice Oracle upsert logic.

**Exercise:** Write a `MERGE` statement that:

- updates employee salary if `employee_id` already exists
- inserts a new employee if not

---

## 🎓 Lesson 20 — Report query

**Goal:** Build one realistic business report.

**Exercise:** Create a monthly order summary with:

- month
- order count
- total amount
- average amount

Sort by month.

Hint:

```sql
TO_CHAR(order_date, 'YYYY-MM')
```

---

## 🧠 Practice Mode

Do not just read the answer. Use this loop:

1. Read one lesson.
2. Hide the note.
3. Write the SQL yourself.
4. Run it.
5. Compare the result with the goal.
6. Rewrite it if it is ugly or slow.

### 20-minute daily routine

```text
5 min   review one concept
10 min  write 2-3 queries from memory
5 min   review mistakes and rewrite
```

### Weekly routine

```text
Mon: SELECT / WHERE / ORDER BY
Tue: JOIN / GROUP BY
Wed: Subquery / EXISTS
Thu: Oracle pagination / NVL / CASE
Fri: Window functions
Sat: Report query
Sun: Review weak points
```

---

## 🤖 AI Practice Method For Faster Growth

Use AI like a SQL trainer.

### Prompt 1 — give me one exercise only

```text
Give me one Oracle SQL exercise at intermediate level.
Do not give the answer first.
Wait for my query and then review it.
```

### Prompt 2 — review my SQL like a senior

```text
Review this Oracle SQL like a senior backend developer.
Check:
- correctness
- readability
- Oracle style
- performance risk
- better rewrite
```

### Prompt 3 — make me improve by level

```text
Act as my Oracle SQL coach.
Give me 10 exercises from easy to hard.
Start with one exercise only.
After I answer, review it and give the next one.
```

### Prompt 4 — convert company SQL into learning mode

```text
I will paste a real Oracle query from work.
Break it into small parts.
Explain each join, filter, subquery, and Oracle-specific syntax.
Then give me 3 practice questions based on it.
```

---

## ✅ SQLBolt-Style Practice Answer Key

Use this section only after you try the lessons yourself.

### Lesson 1 answer

```sql
SELECT employee_id, employee_name, salary
FROM employees;
```

### Lesson 2 answer

```sql
SELECT *
FROM employees
WHERE use_yn = 'Y';
```

Extra drill:

```sql
SELECT *
FROM employees
WHERE salary > 4000000;
```

### Lesson 3 answer

```sql
SELECT *
FROM employees
WHERE use_yn = 'Y'
  AND department_id = 10
  AND salary > 4000000;
```

Extra drill:

```sql
SELECT *
FROM employees
WHERE department_id IN (10, 20);
```

### Lesson 4 answer

```sql
SELECT employee_id, employee_name, salary
FROM employees
ORDER BY salary DESC;
```

Extra drill:

```sql
SELECT employee_id, employee_name, department_id, salary
FROM employees
ORDER BY department_id ASC, salary DESC;
```

### Lesson 5 answer

```sql
SELECT *
FROM employees
WHERE employee_name LIKE 'K%';
```

Extra drill:

```sql
SELECT *
FROM employees
WHERE job_title LIKE '%Developer%';
```

### Lesson 6 answer

```sql
SELECT COUNT(*) AS employee_count,
       AVG(salary) AS avg_salary,
       MAX(salary) AS max_salary
FROM employees;
```

Extra drill:

```sql
SELECT COUNT(*) AS active_employee_count
FROM employees
WHERE use_yn = 'Y';
```

### Lesson 7 answer

```sql
SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
ORDER BY department_id;
```

Extra drill:

```sql
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
ORDER BY department_id;
```

### Lesson 8 answer

```sql
SELECT department_id, AVG(salary) AS avg_salary
FROM employees
GROUP BY department_id
HAVING AVG(salary) > 4000000;
```

Extra drill:

```sql
SELECT department_id, COUNT(*) AS employee_count
FROM employees
GROUP BY department_id
HAVING COUNT(*) >= 2;
```

### Lesson 9 answer

```sql
SELECT e.employee_name,
       d.department_name
FROM employees e
JOIN departments d
  ON e.department_id = d.department_id;
```

Extra drill:

```sql
SELECT e.employee_name,
       d.department_name,
       d.location
FROM employees e
JOIN departments d
  ON e.department_id = d.department_id;
```

### Lesson 10 answer

```sql
SELECT e.employee_name,
       o.order_id,
       o.order_amount,
       o.order_status
FROM employees e
LEFT JOIN orders o
  ON e.employee_id = o.employee_id
ORDER BY e.employee_id, o.order_date;
```

### Lesson 11 answer

```sql
SELECT order_id,
       NVL(order_amount, 0) AS order_amount
FROM orders;
```

Extra drill:

```sql
SELECT employee_name,
       CASE
         WHEN use_yn = 'Y' THEN 'Active'
         ELSE 'Inactive'
       END AS use_status
FROM employees;
```

### Lesson 12 answer

```sql
SELECT *
FROM employees
WHERE hire_date >= DATE '2024-01-01'
  AND hire_date < DATE '2025-01-01';
```

### Lesson 13 answer

```sql
SELECT *
FROM employees
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
);
```

Extra drill:

```sql
SELECT *
FROM employees e
WHERE salary > (
  SELECT AVG(salary)
  FROM employees
  WHERE department_id = e.department_id
);
```

### Lesson 14 answer

```sql
SELECT *
FROM employees e
WHERE EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.employee_id = e.employee_id
);
```

Extra drill:

```sql
SELECT *
FROM employees e
WHERE NOT EXISTS (
  SELECT 1
  FROM orders o
  WHERE o.employee_id = e.employee_id
);
```

### Lesson 15 answer

Exercise A:

```sql
SELECT employee_id, employee_name, salary
FROM employees
ORDER BY employee_id
OFFSET 2 ROWS FETCH NEXT 2 ROWS ONLY;
```

Exercise B:

```sql
SELECT *
FROM (
  SELECT a.*, ROWNUM AS rn
  FROM (
    SELECT employee_id, employee_name, salary
    FROM employees
    ORDER BY employee_id
  ) a
  WHERE ROWNUM <= 4
)
WHERE rn >= 3;
```

### Lesson 16 answer

```sql
SELECT employee_id,
       employee_name,
       department_id,
       salary,
       ROW_NUMBER() OVER (
         PARTITION BY department_id
         ORDER BY salary DESC
       ) AS dept_rank
FROM employees;
```

Extra drill:

```sql
SELECT employee_id,
       employee_name,
       salary,
       RANK() OVER (ORDER BY salary DESC) AS salary_rank,
       DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_dense_rank
FROM employees;
```

### Lesson 17 answer

```sql
SELECT order_id,
       order_date,
       order_amount,
       SUM(order_amount) OVER (ORDER BY order_date, order_id) AS running_total
FROM orders
ORDER BY order_date, order_id;
```

### Lesson 18 answer

```sql
WITH ranked_employees AS (
  SELECT employee_id,
         employee_name,
         department_id,
         salary,
         ROW_NUMBER() OVER (
           PARTITION BY department_id
           ORDER BY salary DESC
         ) AS rn
  FROM employees
)
SELECT *
FROM ranked_employees
WHERE rn <= 2
ORDER BY department_id, rn;
```

### Lesson 19 answer

```sql
MERGE INTO employees t
USING (
  SELECT 1006 AS employee_id,
         10 AS department_id,
         'Yoon Bora' AS employee_name,
         'Backend Developer' AS job_title,
         4300000 AS salary,
         DATE '2025-03-01' AS hire_date,
         'Y' AS use_yn
  FROM DUAL
) s
ON (t.employee_id = s.employee_id)
WHEN MATCHED THEN
  UPDATE SET t.salary = s.salary,
             t.job_title = s.job_title,
             t.department_id = s.department_id,
             t.use_yn = s.use_yn
WHEN NOT MATCHED THEN
  INSERT (
    employee_id,
    department_id,
    employee_name,
    job_title,
    salary,
    hire_date,
    use_yn
  )
  VALUES (
    s.employee_id,
    s.department_id,
    s.employee_name,
    s.job_title,
    s.salary,
    s.hire_date,
    s.use_yn
  );
```

### Lesson 20 answer

```sql
SELECT TO_CHAR(order_date, 'YYYY-MM') AS order_month,
       COUNT(*) AS order_count,
       SUM(order_amount) AS total_amount,
       AVG(order_amount) AS avg_amount
FROM orders
GROUP BY TO_CHAR(order_date, 'YYYY-MM')
ORDER BY order_month;
```

### Better report version with ranking

```sql
WITH monthly_summary AS (
  SELECT TO_CHAR(order_date, 'YYYY-MM') AS order_month,
         COUNT(*) AS order_count,
         SUM(order_amount) AS total_amount,
         AVG(order_amount) AS avg_amount
  FROM orders
  GROUP BY TO_CHAR(order_date, 'YYYY-MM')
)
SELECT order_month,
       order_count,
       total_amount,
       avg_amount,
       RANK() OVER (ORDER BY total_amount DESC) AS sales_rank
FROM monthly_summary
ORDER BY order_month;
```

---

## 🎯 Practical Goal For You

If your company uses Oracle, your near-term goal should be:

- read any company query without panic
- write CRUD and paging SQL alone
- write report queries with `GROUP BY` and window functions
- convert old Oracle syntax into clean modern SQL
- debug slow SQL with `EXPLAIN PLAN`

If you want, next I can also expand this note with:

1. 50 Oracle SQL interview questions
2. 30 real company query exercises with answers
3. Oracle + MyBatis mapper examples for Korean enterprise projects
