# Pipes
It's a class annotated with the `@Injectable()` decorator, which implements the 
`PipeTransform` interface.

## Usage
Pipes are used for two purposes:
- **Transformation:** Transforms input data to the desired one.
- **Validation:** Evaluates data input and if valid, pass it through unchanged. Throws an exception, otherwise.

## Example
Parsing an id using `ParseIntPipe` passed from the request method-scoped, if parsing 
fails, it throws an exception.

```TS
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common"
import { BooksService } from "./books.service"

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id)
  }
}
```

## Creating a custom Pipe validator with `class-validator` and `class-tranformer`

1. Create a DTO
```TS
import { IsString, IsNumber } from "class-validator"

export class CreateBookDto {
  @IsString()
  title: string

  @IsString()
  synopsis: string

  @IsNumber()
  year: number
}
```

2. Register your Pipe Validator in the `app.module.ts` for DI purposes
```TS
import { Module } from "@nestjs/common"
import { APP_PIPE } from "@nestjs/core"

@Module({
  providers: [
    {
      provide: APP_MODULE,
      useClass: ValidationPipe
    }
  ]
})

export class AppModule {}
```

3. Create your controller method as per usual
```TS
import { Body, Controller, Post } from "@nestjs/common"
import { BooksService } from "./books.service"
import { CreateBookDto } from "./dto/create-book.dto"

@Controller('books')
export class BooksController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async create(@Body() book: CreateBookDto): string {
    await this.booksService.create(book)
    return "book created successfully"
  }
}
```