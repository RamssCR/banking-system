# NestJS
NestJS is a progressive Node.js framework for building efficient, reliable, and scalable
server-side applications. It leverages TypeScript and incorporates elements from OOP 
(Object-Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive 
Programming).

## Scripts
- To create an entire API resource using the NestJS CLI, run the following command:
```BASH
nest g resource [name]
```

This script generates the following files:
  - A folder with the named resource and a CRUD-like structure. This folder contains the following files:
    - A folder with DTO files for create and update methods
    - A folder with the resource's empty entities
    - A controller
    - A module
    - A service
    - A test file

