# 🌱 Spring Boot Notes

[<- Back to root](../README.md)

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
| `@RequestMapping` | Base path mapping |
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
@Service
public class UserServiceImpl {

    @Transactional
    public void createUser(UserRequest req) {
        userMapper.insert(req);
        auditMapper.log(req);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAll() {
        return userMapper.selectAll();
    }
}
```

## 🏗️ Recommended Layer Structure

```text
Controller -> Service -> Mapper -> Database
```

| Layer | Role |
| --- | --- |
| `controller/` | Handles HTTP request/response |
| `service/` | Business logic and transaction boundary |
| `mapper/` | SQL mapping via MyBatis |
| `dto/` | Request/response schema |
| `model/` | Table-aligned domain object |
| `config/` | Spring config classes |
| `common/` | Shared response/error utilities |

## ⚙️ `application.properties` baseline

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

mybatis.mapper-locations=classpath:mapper/**/*.xml
mybatis.type-aliases-package=com.yourpackage.model
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
- Keep mapper SQL focused and explicit.
- Return a consistent API response shape.

---

## 📘 Detailed Explanation

### 1. What Spring Boot is really doing for you

Spring Boot is not just a library that gives you annotations.
It gives you a full application runtime that handles:

- object creation
- dependency wiring
- HTTP request dispatching
- transaction handling
- configuration loading
- integration with DB libraries like MyBatis

That means you write business code, and Spring handles most infrastructure code.

### 2. How to think about IoC and DI in real life

If `UserController` needs `UserService`, and `UserService` needs `UserMapper`, you do not create them manually.
Spring creates them in the container and connects them automatically.

Think of it like this:

```text
Spring Container
  -> creates Controller
  -> creates Service
  -> creates Mapper
  -> injects Mapper into Service
  -> injects Service into Controller
```

This matters because:

- code is easier to change
- classes stay focused
- testing becomes easier

### 3. Controller, Service, Mapper — how they should feel

#### Controller

Controller should answer:

- what URL came in?
- what input was sent?
- what response should go back?

It should **not** contain SQL or heavy business logic.

#### Service

Service should answer:

- what business rule should run?
- what order should operations happen in?
- should this be transactional?

This is where your main backend thinking usually lives.

#### Mapper

Mapper should answer:

- what SQL should run?
- what parameter is passed to SQL?
- what result shape comes back?

Keep mapper focused on persistence only.

### 4. Why transactions belong in service

A transaction is a business unit, not an HTTP unit and not a SQL file unit.

Example:

1. insert user
2. insert login history
3. insert audit log

All 3 together form one business action.
So the service method should wrap them in `@Transactional`.

If one fails:

- everything should roll back
- DB should stay consistent

### 5. How request binding works

When Spring sees:

```java
@GetMapping("/{id}")
public ApiResponse<UserResponse> getById(@PathVariable Long id)
```

and the request is:

```text
GET /users/1001
```

Spring automatically:

- reads `1001` from URL
- converts it to `Long`
- passes it into method parameter

Likewise, `@RequestBody` converts JSON to Java object.

### 6. Why config matters so much

Many beginners think backend problems are always code problems.
In real projects, a lot of failures come from configuration:

- wrong datasource URL
- wrong DB credentials
- wrong mapper XML path
- wrong package name for aliases
- wrong logging level

So you should learn to debug config as seriously as Java code.

### 7. Good mental model for Spring Boot projects

When reading a project, use this order:

1. find the controller
2. find the service it calls
3. find the mapper it uses
4. find the SQL or DB call
5. trace the response DTO

If you follow this order repeatedly, the architecture becomes much easier to understand.

---

## 🧪 Better Understanding Questions

Try answering these in your own words:

1. Why is constructor injection better than field injection?
2. Why should controller stay thin?
3. Why is service usually the transaction boundary?
4. What can go wrong if config paths are wrong?
5. What does Spring do automatically when it sees `@RestController`?

---

## 🛠️ Small Practice Tasks

### Task 1

Write a controller method for:

```text
GET /employees/{id}
```

Return one employee response.

### Task 2

Write a service method that:

- inserts employee
- inserts audit log
- uses transaction

### Task 3

Explain the full flow:

```text
Frontend -> Controller -> Service -> Mapper -> DB -> Response
```

If you can explain this clearly, your Spring Boot understanding is getting much stronger.
