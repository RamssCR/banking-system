# Exception Filters

## Creating a custom `HttpException` handler
```TS
import {
  type ArgumentsHost,
  type HttpException,
  Catch,
  ExceptionFilter,
} from "@nestjs/common"
import type { Response } from "express"

@Catch(HttpException)
export class HttpExceptionFilter extends ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const status = exception.getStatus()
    const error = exception.getResponse()

    response.status(status).json({
      success: false,
      timestamp: new Date().toISOString(),
      error
    })
  }
}
```

## Applying it to a controller

```TS
import { 
  BadRequestException,
  Body,
  Controller,
  Post,
  UseFilters,
} from "@nestjs/common"
import { HttpExceptionFilter } from "#common/exceptions/http-exception.filter"
import { UserDto } from "./dto/user.dto"

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  @Post('register')
  async create(@Body() userDto: UserDto) {
    // your code for register method
    if (!userDto.email) throw new BadRequestException('email not provided')
  }
}
```

## Code Snippet to Set Up global exceptions
```TS

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```