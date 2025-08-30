# Banking Systems

## Models

### User
- `id`: `number`
- `role`: `Role`
- `username`: `string` (30)
- `email`: `string` [unique] (45)
- `password`: `string` (300)
- `accounts`: `Account[]`
- `transactions`: `Transaction[]`

### Role
- `id`: `number`
- `name`: `string` (25)
- `users`: `User[]`

### Account
- `id`: `number`
- `accountNumber`: `string` [unique] (id separated by scores, for example)
- `user`: `User` (N:1)
- `balance`: `number`
- `transactionsFrom`: `Transaction[]` (source account)
- `transactionsTo`: `Transaction[]` (destination account)

### Transaction
- `id`: `number`
- `amount`: `number`
- `type`: `DEPOSIT | WITHDRAW | TRANSFER`
- `date`: `Date`
- `status`: `PENDING | FAILED | COMPLETED`
- `sourceAccount`: `Account` (nullable, N:1)
- `destinationAccount`: `Account` (nullable, N:1)
- `performedBy`: `User`

## Relationships

### User - Role
* An user can have one role
* A role is assigned to many users

### User - Transaction
* An user can performed many transactions

### User - Account
* An user can have many accounts
* An account can only be assigned to an user

### Account - Transaction
* An account can perform many transactions

### User - Account - Transaction
* A transaction can only be performed by an account (the model with the permissions) and the user owning the account (for trazability purposes).