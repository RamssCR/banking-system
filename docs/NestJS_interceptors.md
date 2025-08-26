# Interceptors
An interceptor is a class annotated with the `@Injectable()` decorator
and implements the `NestInterceptor` interface.

## Usage
With interceptors, you can:
* Transform the `response` object.
* Log the incoming `request` object.
* Transform the exception response if something fails in the controller.
* Extend the basic function behavior.
* Overrides a function depending on specific conditions (e.g., for caching purposes).

## Sample Usage Snippet
```TS
import { 
  type ExecutionContext, 
  type NestInterceptor, 
  CallHandler 
  Injectable, 
} from "@nestjs/common"
import type { Observable } from "rxjs"
import { tap } from "rxjs/operators"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...')

    const now = Date.now()
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`))
      )
  }
}
```

## Binding Interceptors

### Method-Scoped
```TS
@Get(':id')
@UseInterceptors(LoggingInterceptor)
findOne(@Param('id') id: string) {}
```

### Controller-Scoped
```TS
@Controller('books')
@UseInterceptors(LoggingInterceptor)
export class BooksController {}
```

### Global-Scoped
#### No DI
```TS
const app = await NestFactory(AppModule)
app.useGlobalInterceptor(LoggingInterceptor)
```

### DI
```TS
import { APP_INTERCEPTOR } from "@nestjs/core"
import { Module } from "@nestjs/common"

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ]
})
```

