# Modules
A module is a class that is annotated with the `@Module()` decorator. This decorator 
provides metadata that Nest uses to organize and manage the application structure efficiently.

The `@Module()` decorator takes a single object with properties that describe the module:

| Property        | Description                                             |
|-----------------|---------------------------------------------------------|
| `providers`     | They'll be instantiated by the Nest injector            |
| `controllers`   | Set of controllers that will be instatiated             |
| `imports`       | List of imported modules that export the providers      |
| `exports`       | Subset of `providers` that are provided by this module  |

```TS
import { Module } from "@nestjs/common"
import { BooksService } from "./books.service"
import { BooksController } from "./books.controller"

@Module({
  controllers: [BooksController],
  providers: [BooksService]
})

export class BooksModule {}
```

Our `app.module.ts` should look like this:
```TS
import { BooksModule } from "./books/books.module"
import { Module } from "@nestjs/common"

@Module({
  imports: [BooksModule]
})

export class AppModule {}
```

## Script
To create a module for your resource, run the following commands:

```BASH
nest g module [resource]
```

## Shared Modules
In Nest, modules are singletons by default, and thus you can share the same instance 
of any provider between multiple modules effortlessly.

Every module is automatically a shared module. Once created it can be reused by any module.
In order to do that, we first need to export the resource provider by adding it to the module's
export array.

```TS
import { Module } from "@nestjs/common"
import { BooksService } from "./books.service"
import { BooksController } from "./books.controller"

@Module({
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})

export class BooksModule {}
```

## Module re-exporting
As seen above, Modules can export their internal providers. In addition, they can re-export 
modules that they import. In the example below, the CommonModule is both imported into and 
exported from the CoreModule, making it available for other modules which import this one.

```TS
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## Global Modules
If you have to import the same set of providers everywhere, it can get tedious. Nest encapsulates
providers inside the module scope. You aren't able to use a module's providers elsewhere without
first importing the encapsulating module.

When you want to provide a set of providers which should be available everywhere out-of-the-box,
make the module global with the `@Global()` decorator.

```TS
import { Module, Global } from "@nestjs/common"
import { BooksController } from "./books.controller"
import { BooksService } from "./books.service"

@Global()
@Module({
  controllers: [BooksController],
  providers: [BooksService]
})
```

> [!NOTE]
> Making everything global is not recommended as a design practice. While global modules can help reduce boilerplate, it's generally better to use the `imports` array to make a module's API available to other modules in a controlled and clear way. This approach provides better structure and maintainability, ensuring that only the necessary parts of the module are shared with others while avoiding unnecessary coupling between unrelated parts of the application.

## Dynamic Modules
Dynamic modules in Nest allow you to create modules that can be configured at runtime. 
This is especially useful when you need to provide flexible, customizable modules where 
the providers can be created based on certain options or configurations.

```TS

import { Module, type DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}
```