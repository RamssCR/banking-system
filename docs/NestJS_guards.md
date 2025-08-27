# Guards
A guard is a class annotated with the `@Injectable()` decorator, which implements
the `CanActivate` interface.

## Example
### Authentication (non-role-based)
```TS
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Observable } from "rxjs"

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Always extract the request
    const request = context.switchToHttp().getRequest()

    // validateRequest(request)
  }
}
```

### Roles
```TS
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    return true
  }
}
```

### Set the Guards where needed (globally, for example)
```TS
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

## Creating Roles
### Using the `Reflector.createDecorator`

```TS
import { Reflector } from "@nestjs/core"

export const Roles = Reflector.createDecorator<string[]>()
```

### Using it on a controller
```TS
import { Controller, Get } from "@nestjs/common"
import { Roles } from "#common/roles/roles"

@Controller('books')
export class BooksController {
  @Get()
  @Roles(['admin'])
  async findAll() {
    // your logic here...
  }
}
```

### Enhancing the `RolesGuard`
```TS
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs'
import { Reflector } from "@nestjs/core"
import { Roles } from "#common/roles/roles"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler())
    if (!roles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user = request.user
    // matchRoles(Roles, user.roles)
  }
}
```