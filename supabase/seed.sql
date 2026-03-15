-- ============================================================
-- SEED DATA  –  dev-learning-notes
-- Matches the schema already created in Supabase.
-- Run in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Enable RLS on notes (study_tasks already has it)
alter table public.notes enable row level security;

drop policy if exists "public read notes" on public.notes;
create policy "public read notes"
  on public.notes for select
  to anon, authenticated
  using (true);

drop policy if exists "service role full access notes" on public.notes;
create policy "service role full access notes"
  on public.notes for all
  to service_role
  using (true) with check (true);


-- ============================================================
-- notes  (icon stored as tags[0], category = human label)
-- ============================================================

insert into public.notes (slug, title, description, category, content, tags) values (
  'java', 'Java Core', 'OOP, Collections, Streams, Lambda, Lombok', 'Backend',
  $c$
# ☕ Java Core Notes

## 🎯 Purpose

This page covers Java concepts that are used directly in Spring Boot + MyBatis projects.

## 🧭 Topics at a Glance

- Classes, objects, interfaces, inheritance
- Collections (`List`, `Map`, `Set`)
- Exceptions and custom error handling
- Streams and lambdas
- `Optional` for null safety
- Lombok to reduce boilerplate
- Common `String` utilities

## 🧩 OOP Basics

### Class and object

```java
public class User {
    private Long id;
    private String username;
    private String email;

    public User(Long id, String username, String email) {
        this.id = id;
        this.username = username;
        this.email = email;
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}

User user = new User(1L, "john", "john@test.com");
System.out.println(user.getUsername());
```

### Interface and implementation

```java
public interface UserService {
    List<UserResponse> getAll();
    void create(UserRequest req);
}

@Service
public class UserServiceImpl implements UserService {
    @Override
    public List<UserResponse> getAll() {
        return userMapper.selectAll();
    }

    @Override
    public void create(UserRequest req) {
        userMapper.insert(req);
    }
}
```

### Inheritance

```java
public class BaseEntity {
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

public class User extends BaseEntity {
    private Long id;
    private String username;
}
```

## 📦 Collections

### List (ordered, duplicates allowed)

```java
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.get(0);
names.contains("Bob");
```

### Map (key-value)

```java
Map<String, Object> params = new HashMap<>();
params.put("username", "john");
params.put("status", "ACTIVE");
params.get("username");
```

### Set (no duplicates)

```java
Set<String> statuses = new HashSet<>();
statuses.add("ACTIVE");
statuses.add("INACTIVE");
statuses.add("ACTIVE"); // ignored
```

## 🚨 Exceptions

```java
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found: " + id);
    }
}
```

## ⚙️ Streams and Lambdas

```java
List<User> activeUsers = users.stream()
    .filter(u -> "ACTIVE".equals(u.getStatus()))
    .toList();

List<String> usernames = users.stream()
    .map(User::getUsername)
    .toList();
```

## 🛡️ Optional

```java
Optional<User> user = userMapper.findById(id);
String name = user.map(User::getUsername).orElse("unknown");
User result = user.orElseThrow(() -> new UserNotFoundException(id));
```

## ✂️ Lombok

```java
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
}
```

## 🔤 Common String Utilities

```java
String s = "  Hello World  ";
s.trim();
s.toLowerCase();
s.contains("World");
s.replace("World", "Java");
```

## 💡 Quick Tip

Use constructor injection, clear DTO names, and explicit exceptions to keep backend code maintainable.
$c$,
  '{java}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


insert into public.notes (slug, title, description, category, content, tags) values (
  'springboot', 'Spring Boot', 'IoC/DI, MVC, REST API, Transactions', 'Backend',
  $c$
# 🌱 Spring Boot Notes

## 🎯 Purpose

Core Spring Boot patterns for enterprise-style backend projects.

## 🧠 IoC and DI Essentials

| Annotation | Meaning |
| --- | --- |
| `@Component` | Generic bean |
| `@Service` | Service-layer bean |
| `@Repository` | Persistence-layer bean |
| `@Controller` | MVC controller |
| `@RestController` | JSON API controller |
| `@Configuration` | Bean configuration class |
| `@Bean` | Registers method return as bean |

```java
@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;

    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }
}
```

## 🌐 Web MVC Annotations

| Annotation | Usage |
| --- | --- |
| `@GetMapping` | HTTP GET |
| `@PostMapping` | HTTP POST |
| `@PutMapping` | HTTP PUT |
| `@DeleteMapping` | HTTP DELETE |
| `@PathVariable` | Value from URL path |
| `@RequestParam` | Query parameter |
| `@RequestBody` | JSON request body |

```java
@RestController
@RequestMapping("/users")
public class UserController {

    @GetMapping
    public ApiResponse<List<UserResponse>> getAll() { ... }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getById(@PathVariable Long id) { ... }

    @PostMapping
    public ApiResponse<Void> create(@RequestBody UserRequest req) { ... }
}
```

## 🔄 Transactions

```java
@Transactional
public void createUser(UserRequest req) {
    userMapper.insert(req);
    auditMapper.log(req);
}

@Transactional(readOnly = true)
public List<UserResponse> getAll() {
    return userMapper.selectAll();
}
```

## 🏗️ Recommended Layer Structure

```text
Controller -> Service -> Mapper -> Database
```

## ⚙️ `application.properties` baseline

```properties
server.port=8080
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your_password
mybatis.mapper-locations=classpath:mapper/**/*.xml
mybatis.configuration.map-underscore-to-camel-case=true
logging.level.com.yourpackage.mapper=DEBUG
```

## 📦 Unified API Response Pattern

```java
public class ApiResponse<T> {
    private String resultCd;
    private String resultMsg;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("M0000", "Success", data);
    }

    public static <T> ApiResponse<T> error(String msg) {
        return new ApiResponse<>("E9999", msg, null);
    }
}
```

## 🔐 CORS Example

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

## ✅ Quick Practice Rules

- Prefer constructor injection.
- Keep controller thin; place logic in service.
- Return a consistent API response shape.
$c$,
  '{springboot}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


insert into public.notes (slug, title, description, category, content, tags) values (
  'mybatis', 'MyBatis', 'Dynamic SQL, XML Mapper, Logging', 'Backend',
  $c$
# 🧮 MyBatis Dynamic SQL

## 🎯 Purpose

Dynamic SQL helps you build safe, maintainable queries without manual SQL string concatenation.

## 🧱 Core Tags

| Tag | Use |
| --- | --- |
| `<if>` | Add condition only when a value exists |
| `<where>` | Auto-add `WHERE` and remove leading `AND`/`OR` |
| `<set>` | Auto-build `SET` for update statements |
| `<foreach>` | Iterate list/map for `IN` or batch SQL |
| `<sql>` + `<include>` | Reusable SQL fragment |

## 🔍 `<if>` with `<where>`

```xml
<select id="searchUsers" resultMap="UserMap">
  SELECT * FROM users
  <where>
    <if test="username != null and username != ''">
      AND username = #{username}
    </if>
    <if test="status != null">
      AND status = #{status}
    </if>
  </where>
</select>
```

## 🧭 `<choose>` for controlled sorting

```xml
ORDER BY
<choose>
  <when test="sortBy == 'username'">username</when>
  <when test="sortBy == 'createdAt'">created_at</when>
  <otherwise>id</otherwise>
</choose>
```

## 🔁 `<foreach>` for `IN` and batch operations

```xml
<select id="findByIds" resultMap="UserMap">
  SELECT * FROM users WHERE id IN
  <foreach collection="ids" item="id" open="(" close=")" separator=",">
    #{id}
  </foreach>
</select>
```

## 🛠️ `<set>` for partial update

```xml
<update id="dynamicUpdate">
  UPDATE users
  <set>
    <if test="username != null">username = #{username},</if>
    <if test="email != null">email = #{email},</if>
    <if test="status != null">status = #{status},</if>
  </set>
  WHERE id = #{id}
</update>
```

## ♻️ Reusable fragments

```xml
<sql id="userColumns">id, username, email, status, created_at</sql>

<select id="findAll" resultMap="UserMap">
  SELECT <include refid="userColumns"/> FROM users ORDER BY id DESC
</select>
```

## 🧷 XML Escaping Rules

| Char | Escape |
| --- | --- |
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |

## 📜 SQL Logging

```properties
logging.level.com.yourpackage.mapper=DEBUG
mybatis.configuration.log-impl=org.apache.ibatis.logging.stdout.StdOutImpl
```
$c$,
  '{mybatis}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


insert into public.notes (slug, title, description, category, content, tags) values (
  'sql', 'SQL Fundamentals', 'SELECT, JOIN, Aggregates, Pagination', 'Database',
  $c$
# 🗃️ SQL Fundamentals

## 🎯 Purpose

Daily SQL reference for CRUD, filtering, joins, and aggregation.

## 🧱 Statement Types

| Type | Purpose |
| --- | --- |
| `SELECT` | Read data |
| `INSERT` | Add data |
| `UPDATE` | Change data |
| `DELETE` | Remove data |

## 📐 Basic Query Shape

```sql
SELECT columns FROM table WHERE condition ORDER BY column LIMIT n OFFSET m;
```

## 🔎 Filtering

```sql
SELECT * FROM users WHERE status = 'ACTIVE';
SELECT * FROM users WHERE status = 'ACTIVE' AND age >= 18;
SELECT * FROM users WHERE id IN (1, 2, 3);
SELECT * FROM users WHERE age BETWEEN 18 AND 30;
SELECT * FROM users WHERE username LIKE '%john%';
```

## 📄 Pagination

```sql
SELECT * FROM users LIMIT 10 OFFSET 0;  -- page 1
SELECT * FROM users LIMIT 10 OFFSET 10; -- page 2
-- formula: offset = (page - 1) * page_size
```

## ✍️ Write Operations

```sql
INSERT INTO users (username, email, status) VALUES ('john', 'john@test.com', 'ACTIVE');
UPDATE users SET status = 'INACTIVE' WHERE id = 1;
DELETE FROM users WHERE id = 1;
```

## 🔗 JOIN

```sql
SELECT u.username, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;

SELECT u.username, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

## 📊 Aggregation

```sql
SELECT status, COUNT(*) AS cnt FROM users GROUP BY status HAVING COUNT(*) > 10;
SELECT MAX(created_at), MIN(created_at), AVG(age) FROM users;
```

## 🧠 Execution Order

```
FROM → JOIN → WHERE → GROUP BY → SELECT → HAVING → ORDER BY → LIMIT/OFFSET
```
$c$,
  '{sql}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


insert into public.notes (slug, title, description, category, content, tags) values (
  'jsp-jstl', 'JSP & JSTL', 'Templates, Tags, Formatting', 'Frontend',
  $c$
# JSP and JSTL Notes

## Purpose

JSP renders HTML on the server, and JSTL keeps templates clean by replacing scriptlets with tags.

## Page Setup

```jsp
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
```

## Core JSTL Tags

### Output

```jsp
<c:out value="${user.username}"/>
```

### Conditional

```jsp
<c:if test="${user.status == 'ACTIVE'}">
  <span class="badge-active">Active</span>
</c:if>
```

### Branching

```jsp
<c:choose>
  <c:when test="${user.status == 'ACTIVE'}">Active</c:when>
  <c:when test="${user.status == 'INACTIVE'}">Inactive</c:when>
  <c:otherwise>Unknown</c:otherwise>
</c:choose>
```

### Loop

```jsp
<c:forEach var="user" items="${users}" varStatus="s">
  <tr>
    <td>${s.count}</td>
    <td><c:out value="${user.username}"/></td>
    <td><c:out value="${user.email}"/></td>
  </tr>
</c:forEach>
```

## Expression Language (EL)

```jsp
${user.username}
${empty users}
${user.status == 'ACTIVE' ? 'Yes' : 'No'}
```

## Formatting

```jsp
<fmt:formatDate value="${user.createdAt}" pattern="yyyy-MM-dd HH:mm"/>
<fmt:formatNumber value="${amount}" pattern="#,###"/>
```

## Controller to JSP Data Flow

```java
@GetMapping("/user-list")
public String userList(Model model) {
    model.addAttribute("users", userService.getAll());
    return "user-list";
}
```

## Common Mistakes

| Mistake | Better approach |
| --- | --- |
| Raw `${...}` for user input | Use `<c:out>` for escaping |
| Missing `taglib` directives | Declare at top of every JSP |
| Business logic in JSP | Keep logic in service/controller |
$c$,
  '{jsp-jstl}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


insert into public.notes (slug, title, description, category, content, tags) values (
  'jquery', 'jQuery & AJAX', 'DOM, AJAX patterns, Form handling', 'Frontend',
  $c$
# jQuery and AJAX Notes

## Purpose

Practical jQuery patterns for legacy-friendly frontends that call Spring Boot REST APIs.

## Setup

```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
```

## Core AJAX Patterns

### GET

```javascript
$.ajax({
  url: '/users',
  type: 'GET',
  dataType: 'json',
  success: function (result) {
    if (result.resultCd === 'M0000') renderTable(result.data);
  },
  error: function (xhr, status, error) {
    alert('Failed: ' + error);
  }
});
```

### POST

```javascript
$.ajax({
  url: '/users',
  type: 'POST',
  contentType: 'application/json',
  data: JSON.stringify({
    username: $('#username').val(),
    email: $('#email').val(),
    status: 'ACTIVE'
  })
});
```

### PUT and DELETE

```javascript
$.ajax({ url: '/users/' + id, type: 'PUT',    contentType: 'application/json', data: JSON.stringify({ username: 'new' }) });
$.ajax({ url: '/users/' + id, type: 'DELETE' });
```

## DOM and Events

```javascript
$('#username').val();
$('#title').text('New Title');
$('#modal').toggle();
$('#btn').addClass('active');

$(function () { loadUsers(); });

$('#saveBtn').click(function () { saveUser(); });

$(document).on('click', '.deleteBtn', function () {
  deleteUser($(this).data('id'));
});
```

## Render Table Safely

```javascript
function renderTable(users) {
  const tbody = $('#userTable tbody').empty();
  if (!users?.length) {
    tbody.append('<tr><td colspan="5">No data</td></tr>');
    return;
  }
  users.forEach(function (user, i) {
    tbody.append(`<tr>
      <td>${i + 1}</td>
      <td>${escapeHtml(user.username)}</td>
      <td>${escapeHtml(user.email)}</td>
    </tr>`);
  });
}

function escapeHtml(str) {
  return $('<div>').text(str ?? '').html();
}
```

## Form Validation

```javascript
function saveUser() {
  const username = $('#username').val().trim();
  const email = $('#email').val().trim();
  if (!username) { alert('Username is required.'); return; }
  if (!email.includes('@')) { alert('Valid email is required.'); return; }
  $.ajax({ url: '/users', type: 'POST', contentType: 'application/json',
    data: JSON.stringify({ username, email, status: 'ACTIVE' }) });
}
```

## Global Error Handling

```javascript
$(document).ajaxError(function (event, xhr) {
  if (xhr.status === 401) window.location.href = '/login';
  else if (xhr.status === 500) alert('Server error. Please try again.');
});
```
$c$,
  '{jquery}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


insert into public.notes (slug, title, description, category, content, tags) values (
  'projects', 'Projects', 'Full-stack project references', 'Reference',
  $c$
# Practice Projects

## Purpose

Reference project setup and realistic practice roadmap for enterprise-style backend development.

## Reference Project: `spring-mybatis-test`

User Management with Spring Boot + MyBatis + JSP/JSTL + jQuery + PostgreSQL.

## Stack

| Layer | Technology |
| --- | --- |
| Language | Java 17 |
| Framework | Spring Boot 3.x |
| SQL Mapper | MyBatis 3.x |
| View | JSP + JSTL (Jakarta tags) |
| Frontend | jQuery 3.7.x |
| Database | PostgreSQL |
| Build | Maven |

## Recommended Structure

```text
src/main/java/com/example/app/
  common/ config/ controller/ dto/ mapper/ model/ service/
src/main/resources/
  application.properties  mapper/
src/main/webapp/
  css/ js/ WEB-INF/views/
```

## Database Setup

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  status VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Run

```bash
./mvnw spring-boot:run
```

## APIs

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/users` | Get all users |
| `GET` | `/users/{id}` | Get one user |
| `POST` | `/users` | Create user |
| `PUT` | `/users/{id}` | Update user |
| `DELETE` | `/users/{id}` | Delete user |

## Practice Project Ideas

1. **Board/BBS** — Post CRUD, pagination, comments, file upload
2. **Employee Management** — CRUD, role-based access, Excel export
3. **Order Management** — Catalog, order flow, status tracking, reports

## Skills Checklist

### Junior
- [ ] CRUD with MyBatis XML mapper
- [ ] JSP pages with JSTL loops/conditions
- [ ] AJAX CRUD with jQuery
- [ ] Pagination (`LIMIT/OFFSET`)

### Mid
- [ ] Complex join queries
- [ ] Spring Security login/roles
- [ ] `@Transactional` usage
- [ ] Global exception handling

### Senior
- [ ] SQL optimization (`EXPLAIN`, indexes)
- [ ] Architecture and coding standards
- [ ] CI/CD and deployment automation
$c$,
  '{projects}'
) on conflict (slug) do update
  set title = excluded.title, description = excluded.description,
      category = excluded.category, content = excluded.content, tags = excluded.tags;


-- ============================================================
-- study_tasks  (Learning task board — replaces localStorage)
-- ============================================================

insert into public.study_tasks (title, phase, category, notes, status, sort_order) values
  ('Java & SQL Mastery',    'Phase 01', 'Core Foundation', 'Java OOP, Collections, Streams, Lambdas. SQL SELECT/JOIN/Aggregates/Pagination.', 'done',  1),
  ('Spring Boot & MyBatis', 'Phase 02', 'Backend Dev',     'IoC/DI, REST API, Transactions. MyBatis dynamic SQL and XML mappers.',            'done',  2),
  ('JSP, JSTL & jQuery',   'Phase 03', 'Frontend Legacy', 'Server-side templating with JSTL tags. AJAX patterns with jQuery.',                'doing', 3),
  ('CI/CD & Cloud',         'Phase 04', 'Deployment',      'Pipeline setup, containerisation, and cloud deployment automation.',               'todo',  4)
on conflict do nothing;
