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
