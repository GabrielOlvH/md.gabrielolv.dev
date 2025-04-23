---
title: "Advanced TypeScript Patterns for Enterprise Applications"
date: "2025-04-15"
tags: ["TypeScript", "JavaScript", "Software Architecture", "Design Patterns"]
excerpt: "Explore advanced TypeScript patterns that can help you build more maintainable and robust enterprise applications."
---

# Advanced TypeScript Patterns for Enterprise Applications

TypeScript has become the language of choice for many enterprise applications due to its strong typing system and excellent tooling. In this post, we'll explore some advanced patterns that can help you build more robust and maintainable applications.

## Type-Level Programming

TypeScript's type system is Turing complete, allowing for powerful type-level programming:

```typescript
// Recursive type for deep readonly
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object 
    ? DeepReadonly<T[P]> 
    : T[P];
};

// Usage
interface User {
  name: string;
  profile: {
    age: number;
    address: {
      city: string;
      country: string;
    }
  }
}

const user: DeepReadonly<User> = {
  name: "John",
  profile: {
    age: 30,
    address: {
      city: "New York",
      country: "USA"
    }
  }
};

// This would cause a type error
// user.profile.address.city = "Boston";
```

## The Builder Pattern

The Builder pattern is useful for creating complex objects step by step:

```typescript
class RequestBuilder {
  private url: string = '';
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  private headers: Record<string, string> = {};
  private body: any = null;

  setUrl(url: string): RequestBuilder {
    this.url = url;
    return this;
  }

  setMethod(method: 'GET' | 'POST' | 'PUT' | 'DELETE'): RequestBuilder {
    this.method = method;
    return this;
  }

  setHeader(key: string, value: string): RequestBuilder {
    this.headers[key] = value;
    return this;
  }

  setBody(body: any): RequestBuilder {
    this.body = body;
    return this;
  }

  build(): Request {
    return new Request(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body ? JSON.stringify(this.body) : null
    });
  }
}

// Usage
const request = new RequestBuilder()
  .setUrl('https://api.example.com/users')
  .setMethod('POST')
  .setHeader('Content-Type', 'application/json')
  .setBody({ name: 'John Doe', email: 'john@example.com' })
  .build();
```

## Discriminated Unions

Discriminated unions are a powerful pattern for type-safe handling of different states:

```typescript
type NetworkState = 
  | { state: 'loading' }
  | { state: 'success'; data: string }
  | { state: 'error'; error: Error };

function handleNetworkState(state: NetworkState): string {
  switch (state.state) {
    case 'loading':
      return 'Loading...';
    case 'success':
      return `Data: ${state.data}`;
    case 'error':
      return `Error: ${state.error.message}`;
  }
}

// Usage
const loadingState: NetworkState = { state: 'loading' };
console.log(handleNetworkState(loadingState)); // "Loading..."

const successState: NetworkState = { state: 'success', data: 'User data' };
console.log(handleNetworkState(successState)); // "Data: User data"
```

## Dependency Injection

TypeScript works well with dependency injection patterns:

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

class UserService {
  constructor(private logger: Logger) {}

  createUser(name: string, email: string): void {
    // Create user logic
    this.logger.log(`User created: ${name} (${email})`);
  }
}

// Usage
const logger = new ConsoleLogger();
const userService = new UserService(logger);
userService.createUser('John Doe', 'john@example.com');
```

## Utility Types

TypeScript provides several built-in utility types that can help you manipulate types:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

// Omit certain properties
type PublicUser = Omit<User, 'password'>;

// Pick only certain properties
type UserCredentials = Pick<User, 'email' | 'password'>;

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required
type RequiredUser = Required<PartialUser>;

// Extract union types
type StringOrNumber = string | number | boolean;
type ExtractedType = Extract<StringOrNumber, string | number>; // string | number

// Exclude union types
type ExcludedType = Exclude<StringOrNumber, boolean>; // string | number
```

## Conclusion

TypeScript's type system offers powerful tools for building robust enterprise applications. By leveraging patterns like discriminated unions, dependency injection, and advanced type manipulations, you can create more maintainable and error-resistant code.

Remember that the goal of these patterns is not just to satisfy the type system, but to create code that is easier to understand, maintain, and refactor.

> "Make illegal states unrepresentable." — Yaron Minsky

This principle is at the heart of TypeScript's type system and should guide your design decisions when building complex applications.

Happy coding!
