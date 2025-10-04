# Banking System API

A **learning project built with [NestJS](https://nestjs.com/)** simulating a simplified **banking system**.
The goal of this project is to explore **clean architecture, good practices, database transactions, and modular design** while implementing realistic banking operations such as deposits, withdrawals, and transfers.

---

## Main Features

* **User Management**:
  Create and manage users with associated accounts.

* **Accounts**:

  * Each user can own one or more bank accounts.
  * Accounts maintain a balance and unique account number (validated with the **Luhn algorithm**).

* **Transactions**:

  * **Deposits**: Increase balance on a destination account.
  * **Withdrawals**: Decrease balance on a source account (validating sufficient funds).
  * **Transfers**: Move funds between two accounts atomically.
  * All operations use **database transactions with locks** to ensure data consistency.

* **Audit Fields**:
  Each transaction stores who performed it (`performedBy`) and supports possible reversals or references for rollback-like behavior.

* **JWT Authentication**:
  With **access** and **refresh tokens** for secure endpoints.

---

## Tech Stack

* **Backend Framework**: [NestJS](https://nestjs.com/)
* **Database ORM**: [TypeORM](https://typeorm.io/)
* **Database**: PostgreSQL
* **Authentication**: JWT (access & refresh tokens)
* **Validation & Pipes**: Class-validator + Class-transformer
* **Error Handling**: Custom helpers for DB errors and global exception filters

---

## 📂 Project Structure

```
src
 ├── accounts/          # Account entity, service, controller
 ├── auth/              # Auth entity, service, controller
 ├── transactions/      # Transaction entity, service, controller
 ├── users/             # User entity, service, controller
 ├── roles/             # Role entity, service, controller
 ├── common/            # Shared modules: entities, interceptors, filters, helpers
 ├── app.module.ts      # Root module
 └── main.ts            # Application bootstrap
```

---

## ⚙️ Environment Variables

The app requires a `.env` file at the project root with the following configuration:

```shell
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
PORT=2001
DB_HOST=localhost
DB_NAME=banking_system
DB_USER=postgres
DB_PASSWORD=postgres
DB_PORT=5432
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
```

---

## 🚀 Installation & Running

1. **Clone repository**

```bash
git clone https://github.com/RamssCR/banking-system.git
cd banking-system
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment**

* Create `.env` file at project root with variables above.

4. **Start development server**

```bash
npm run start:dev
```

The app will run at: `http://localhost:2001`

---

## API Endpoints (Overview)

### Accounts

* `POST /accounts` → Create account
* `GET /accounts` → List accounts (with transactions)

### Transactions

* `POST /transactions/deposit` → Deposit funds
* `POST /transactions/withdraw` → Withdraw funds
* `POST /transactions/transfer` → Transfer funds

### Auth

* `POST /auth/register` → Register new user
* `POST /auth/login` → Login user

---

## Purpose of this Project

This project was built as a **learning path to NestJS**, focusing on:

* Clean architecture & dependency injection.
* Using **database transactions and pessimistic locks** for financial operations.
* Writing code that is **testable** and scalable.
* Applying **realistic banking concepts** to better understand how critical systems work.