# Middleware
Middleware is a function called before the route handler. It has access to the
request and response object and can modify them anytime, it also calls the `next()`
function to call the next middleware or controller and can end the request-response
cycle before even reaching the controller itself.

You implement custom Nest middleware in either a function or a class with the `@Injectable()`
decorator. It must implement the `NestMiddleware` interface.

```TS
import type { NextFunction, Request, Response } from "express"
import { Injectable, type NestMiddleware } from "@nestjs/common"

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('logging request')
    next()
  }
}
```

## Dependency Injection
Nest middleware fully supports Dependency Injection. Just as with providers and controllers, 
they are able to inject dependencies that are available within the same module. As usual, 
this is done through the constructor.

## Applying Middleware
Middlewares aren't setup in the `@Module()` decorator but rather the `configure` method of the
resource module class and have to implement the `NestModule` interface.

```TS
import { 
  type MiddlewareConsumer,
  type NestModule,
  Module,
} from "@nestjs/common"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { BooksModule } from "./books/books.module"

@Module({
  imports: [BooksModule]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('books')
  }
}
```

You can further restrict middlewares to a specific route by passing a route object to
the `forRoutes` method. Import the `RequestMethod` enum to specify the request method
the middleware is gonna be applied on.

```TS
import { 
  type MiddlewareConsumer,
  type NestModule,
  Module,
  RequestMethod
} from "@nestjs/common"
import { LoggerMiddleware } from "./common/middleware/logger.middleware"
import { BooksModule } from "./books/books.module"

@Module({
  imports: [BooksModule]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        { path: 'books', method: RequestMethod.GET },
        { path: 'books', method: RequestMethod.POST }
      )
  }
}
```

> The `configure()` method can be made asynchronous using `async/await` (e.g., you can await completion of an asynchronous operation inside the `configure()` method body).

## Excluding Routes
In order to exclude routes from having middleware applied, we must set them in the
`exclude` property of the `consumer` object.

```TS
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'books', method: RequestMethod.GET },
    'books/{*wildcard}'
  )
  .forRoutes(BooksController)
```

## Functional Middleware
NestJS allows you to create functional middleware the Express way, in the cases where it
doesn't have any properties, additional methods or dependencies.

```TS
import type { RequestHandler } from "express"

export const logger: RequestHandler = (req, res, next) => {
  console.log('logging request...')
  next()
}
```

In the `AppModule`

```TS
consumer
  .apply(logger)
  .forRoutes(BooksController)
```

## Multiple Middleware
Multiple middlewares can be added separated by commas:

```TS
consumer.apply(cors(), helmet(), logger).forRoutes(BooksController)
```

## Global Middleware
If we want to bind a middleware to every registered route at once, we can use the `use` method
supplied by the `INestApplication` instance.

```TS
const app = NestFactory.create<NestExpressApplication>(AppModule)
app.use(logger)
await app.listen(PORT, () => console.log(`App running on port ${PORT}`))
```