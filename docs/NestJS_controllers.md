# Controllers
Controllers are responsible for handling incoming requests and returning responses 
to the client. They act as the intermediary between the client and the application's 
services.

## Scripts
- To create a controller using the NestJS CLI, run the following command:
```bash
nest g controller [name]
```

## `@controller()` decorator
It allows NestJS to group related routes together, reducing repetitive code.

```TS
import { Controller, Get } from "@nestjs/common"

@controller('books')
export class BooksController {
  @Get()
  findAll(): string {
    return "This controller returns all books"
  }
}
```

## `@Get()` decorator
The `@Get()` decorator sets a controller method as a GET entry. On the example above,
`@Controller()` has a route path to `/books`, leaving `@Get()` empty results in a `GET /books`
fetch. However, by adding an optional parameter to it (for example, "category"), results in
a `GET /books/category` fetch.

## Request Object
Nest provides access to the Request Object from the underlying platform (Express by default).
You can access the request object by instructing Nest to inject it using the `@Req` decorator
in the handler's signature.

```TS
import { Controller, Get, Req } from "@nestjs/common"
import type { Request } from "express"

@Controller("books")
export class BooksController {
  @Get()
  findAll(@Req request: Request): string {
    return "This action returns all books"
  }
}
```

> [!HINT]
> To take advantage of express typings, make sure to install the `@types/express` types package.

### List of Decorators

| Decorator                  | Platform                           |
|----------------------------|------------------------------------|
| `@Request`, `@Req`         | `req`                              |
| `@Response`, `@Res`        | `res`                              |
| `@Next`                    | `next`                             |
| `@Session`                 | `req.session`                      |
| `@Param(key?: string)`     | `req.params`, `req.params[key]`    |
| `@Body(key?: string)`      | `req.body`, `req.body[key]`        |
| `@Headers(name?: string)`  | `req.headers`, `req.headers[name]` |
| `@Ip()`                    | `req.ip`                           |
| `@HostParam()`             | `req.hosts`                        |

Nest provides `@Res` and `@Response` decorators, which `@Res` is an alias for `@Response()` and both exposing the underlying native `response` object interface. When using them, also import the typings for the underlying library (e.g., `@types/express`) to take full advantage.

When injecting `@Res` or `@Response`, NestJS enters into Library-specific mode for the affected handler, you must issue a response by making a call on the `response` object (e.g., `res.json(...)`) or the HTTP server will hang.

## `@Post()`
The `@Post()` decorator converts a method into a resource creator, allowing you to handle incoming resource creation requests.

```TS
import { Controller, Get, Post } from "@nestjs/common"

@Controller("books")
export class BooksController {
  @Get()
  findAll(): string {
    return "This action returns all books"
  }

  @Post()
  create(): string {
    return "This action creates a new book"
  }
}
```

## Route Wildcards
Pattern-based routes are also supported in NestJS. The asterisk can be used as a wildcard to match any combination of characters in a route at the end of a path.

```TS
@Get('route/*')
findAll() {
  return "This route uses a wildcard"
}
```

## Status Code
The default status code for responses is always 200, except for POSY requests, which default to 201. You can use the `@HttpCode()` decorator to change that behaviour at the handler level.

```TS
import { HttpCode } from "@nestjs/common"

@Post()
@HttpCode(204)
create() {
  return "This action adds a new book"
}
```

Often, your status code isn't static but depends on various factors. In that case, you can use a library-specific response (inject using `@Res()`) object.

## Response Headers
To specify a custom response header, you can either use the `@Header()` decorator or a library-specific response object (and call `res.header()` directly).

```TS
import { Header } from "@nestjs/common"

@Post()
@Header('Cache-Control', 'no-store')
create() {
  return "This action adds a book"
}
```

## Redirection
To redirect a response to a specific URL, you can use a `@Redirect()` decorator or a library-specific response object (and call `res.redirect()` directly).

```TS
import { Redirect } from "@nestjs/common"

@Get()
@Redirect("https://my-website.com", 301)
```

Returned values will override any arguments passed to the `@Redirect()` decorator.

```TS
@Get("books")
@Redirect("https://docs.library.com", 302)
getBooks(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.library.com/v5' }
  }
}
```

## Route Parameters
To define routes with parameters, you can add route parameter tokens in the route path to capture the dynamic values from the URL. Routes with parameters should be declared after any static path. This prevents the parametized paths from intercepting traffic destined for the static paths.

```TS
import { Param } from "@nestjs/common"

@Controller('books')
class BooksController {
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns the ${id} book`
  }
}
```

## Asynchronicity
Nest fully supports `async` functions. Every `async` function must reutrn a `Promise`, which allows you to return a deferred value that Nest can resolve automatically.

However, Nest takes it a step further by allowing route handlers to return RxJS observable streams as well. Nest will handle the subscription internally and resolve the final emitted value once the stream completes.

```TS
@Get
findAll(): Observable<unknown[]> {
  return of([])
}
```

## Request Payload
In order to understand how managing request payloads work, we need to understand what DTOs (or Data Transfer Object) are.

A DTO is an object that specifies how data should be sent over the network. Nest recommends defining these DTOs by using classes, because they are part of the ES6 standard that remain intact after compilation. 

In contrast, TypeScript interfaces are removed during compilation, meaning Nest can't reference them at runtime. Features like Pipes rely on having access to the metatype of variables at runtime.

## Structure
- `/[resource]`
  - `/dto`
    - `create-[resource].dto.ts`
    - `update-[resource].dto.ts`

### Example
1. Let's first create a DTO class.

`/books/dto/create-book.dto.ts`
```TS
export class CreateBookDto {
  title: string
  synopsis: string
  author: string
  genre: string
}
```

2. This class can be used as a type validator inside the controller.

`/books/books.controller.ts`
```TS
@Controller('books')
export class BooksController {
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    return 'This action adds a new book'
  }
}
```

> Nest's `ValidationPipe` can filter out properties that should not be received by the method handler.

## Query Parameters
The `@Query()` decorator is used to extract queries from the user's incoming request.

```TS
@Controller('books')
export class BooksController {
  @Get()
  async findAll(@Query('category') category: string) {
    return `This action returns all books by category: ${category}`
  }
}
```

> [!NOTE]
> In order to configure your HTTP adapter to use an appropiate query parser. In express, you can use the `extended` parser, which allows for rich query objects:

```TS
const app = await NestFactory.create<NestExpressApplication>(AppModule)
app.set('query parser', 'extended')
```

## Controllers Module
Even with we have a fully defined controller, Nest doesn't yet know about it and won't automatically create an instance of the class.

Controller must always be part of a module, which is why we include the `controllers` array within the `@Module()` decorator.

```TS
import { Module } from "@nestjs/common"
import { BooksController } from "./books/books.controller"

@Module({
  controllers: [BooksController]
})
export class AppModule {}
```

Nest also has a library-specific approach, giving you full control of the response's object, such
as this example portrays:

```TS
import type { Response } from "express"

@Get()
async findAll(@Res() res: Response) {
  res.status(HttpStatus.OK).json([])
}
```

However, by using this approach, you lose all Nest features like interceptors or the `@HttpCode()` /
`@Header()` decorators. Nest allows you to address this by passing the property `passthrough: true`
to the native response object. This way, you can handle response's interactions like setting cookies
or modifying headers while leaving the framework do the rest.

```TS
import { Get, HttpStatus, Res } from "@nestjs/common"
import type { Response } from "express"

@Get('books')
async findAll(@Res({ passthrough: true }) res: Response) {
  res.cookie('token', 'your-token')
  res.status(HttpStatus.OK)
  return []
}
```