# ☕ Java Core Notes

[<- Back to root](../README.md)

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
names.add("Alice");

names.get(0);
names.size();
names.contains("Bob");
```

### Map (key-value)

```java
Map<String, Object> params = new HashMap<>();
params.put("username", "john");
params.put("status", "ACTIVE");

params.get("username");
params.containsKey("email");
```

### Set (no duplicates)

```java
Set<String> statuses = new HashSet<>();
statuses.add("ACTIVE");
statuses.add("INACTIVE");
statuses.add("ACTIVE");
```

## 🚨 Exceptions

```java
try {
    User user = userMapper.findById(id);
    if (user == null) {
        throw new RuntimeException("User not found: " + id);
    }
} catch (RuntimeException e) {
    System.out.println("Error: " + e.getMessage());
}
```

```java
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(Long id) {
        super("User not found: " + id);
    }
}
```

## ⚙️ Streams and Lambdas

```java
List<User> users = userMapper.selectAll();

List<User> activeUsers = users.stream()
    .filter(u -> "ACTIVE".equals(u.getStatus()))
    .toList();

List<String> usernames = users.stream()
    .map(User::getUsername)
    .toList();

boolean hasAdmin = users.stream()
    .anyMatch(u -> "ADMIN".equals(u.getRole()));
```

```java
Runnable r = () -> System.out.println("Hello");
Comparator<User> byName = (a, b) -> a.getUsername().compareTo(b.getUsername());
```

## 🛡️ Optional

```java
Optional<User> user = userMapper.findById(id);
String name = user.map(User::getUsername).orElse("unknown");
User result = user.orElseThrow(() -> new UserNotFoundException(id));
```

## ✂️ Lombok

```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
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
s.toUpperCase();
s.contains("World");
s.replace("World", "Java");
```

## 💡 Quick Tip

Use constructor injection, clear DTO names, and explicit exceptions to keep backend code maintainable.
