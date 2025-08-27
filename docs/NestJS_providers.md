# Providers
Providers are a core concept of NestJS, whose philosophy is to be injected as dependencies,
allowing objects to form various relationships with each other. The responsibility of
"wiring up" these objects is largely handled by the Nest runtime system.

> Since Nest allows you to design and organize dependencies in an object-oriented manner, it suggests you to follow SOLID principles.

## Services
Services are in charge of handling all the business logic of the application.

```TS
import { Injectable } from "@nestjs/common"
import { Book } from "./interfaces/book.interface"

@Injectable()
export class BooksService {
  private readonly books: Book[] = []

  create(book: Book) {
    this.books.push(book)
  }

  findAll(): Book[] {
    return this.books
  }
}
```

This services contains two methods: Create and Find all books, the key here is the `@Injectable()`
decorator, which attaches metadata to the class, signaling that `BooksService` is a class that
can be managed by the Nest IoC (Inversion of Control) container.

## Scripts
To generate a service file for your resource, you can run the following command:

```BASH
nest g service [resource]
```

Now, having a full service handler, we can add it to the books controller, like so:

```TS
import { Body, Controller, Get, Post } from "@nestjs/common"
import { Book } from "./interface/book.interface"
import { BooksService } from "./books.service"
import { CreateBookDto } from "./dto/create-book.dto"

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(): Book[] {
    return this.booksService.findAll()
  }

  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    this.booksService.create(createBookDto)
  }
}
```

## Dependency Injection
Dependency Injection (or DI) is a design pattern and mechanism that delivers some parts
of a code to another one in an aplication.

In NestJS, thanks to TypeScript, managing dependencies is straight-forward since they're
resolved thanks to their type.

## Scopes
Scopes in NestJS are lifecycles services are tied to. Normally, they're tied to the
bootstrap/shut-down lifecycle of the application (similar to React's `useEffect` hook in 
the frontend). However, you can define specific request-scopes for your providers, tying
their lifetime to a request rather than the application's lifecycle.

## Custom Providers
Nest comes with a built-in IoC container that handles the communication between providers.
There are several ways to define a provider: you can use plain values, classes and both
asynchronous or synchronous factories.

## Optional Providers
A provider can be optional by assigning an `@Optional()` decorator as parameter in the
service constructor. If no object is provided, it should not result in an error.

```TS
import { Inject, Injectable, Optional } from "@nestjs/common"

@Injectable()
export class HttpService<T> {
  constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

## Property-based Injection
The technique used up to this point is called constructor-based injection, where providers
are injected through the constructor method. Property-based injection can be useful if,
for example, your top-level class depends on one or more providers, passing them all the way
up through `super()` in sub-classes can become cumbersome. To avoid this, you can use the
`@Inject()` decorator directly at the property level.

```TS
import { Inject, Injectable } from "@nestjs/common"

@Injectable()
export class HttpService<T> {
  @Inject('HTTP_OPTIONS')
  private readonly httpService: T
}
```

> [!WARNING]
> If your class doesn't extend another one, use constructor-based injection instead.

## Provider Registration
This is done by editing the module file (`app.module.ts` in this case) and adding the service to
the `providers` array in the `@Module()` decorator.

```TS
import { BooksController } from "./books.controller"
import { BooksService } from "./books.service"
import { Module } from "@nestjs/common"

@Module({
  controllers: [BooksController],
  providers: [BooksService]
})

export class AppModule {}
```