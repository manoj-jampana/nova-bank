# Banking App — Spring Boot + MySQL

A complete beginner-friendly banking backend with a small browser UI.

## Features
- Create bank accounts with an automatically generated 10-digit account number
- Store accounts in MySQL using Spring Data JPA/Hibernate
- Deposit money
- Withdraw money with insufficient-balance validation
- Transfer money between two accounts
- Transaction history
- Close an account only when its balance is zero
- REST APIs
- Simple HTML/JavaScript frontend served by Spring Boot
- Global error handling and request validation

## Technologies
Java 17, Spring Boot 4.1, Spring Web, Spring Data JPA, Hibernate, MySQL, Maven, HTML/CSS/JavaScript.

## 1. Create the database
Open MySQL:
```sql
CREATE DATABASE banking_db;
```
No tables need to be created manually; Hibernate creates/updates them.

## 2. Configure MySQL password
Edit `src/main/resources/application.properties` and replace `YOUR_MYSQL_PASSWORD` with your MySQL root password.

## 3. Run
```bash
mvn spring-boot:run
```
Or on Windows:
```bat
mvnw.cmd spring-boot:run
```

Open `http://localhost:8080/` for the UI.

## REST API
- `POST /api/accounts`
- `GET /api/accounts`
- `GET /api/accounts/{accountNumber}`
- `POST /api/accounts/{accountNumber}/deposit`
- `POST /api/accounts/{accountNumber}/withdraw`
- `POST /api/transfers`
- `GET /api/accounts/{accountNumber}/transactions`
- `DELETE /api/accounts/{accountNumber}`

### Create account JSON
```json
{"holderName":"Manoj Kumar","email":"manoj@example.com","initialDeposit":5000}
```
### Deposit/withdraw JSON
```json
{"amount":1000}
```
### Transfer JSON
```json
{"fromAccount":"1000000001","toAccount":"1000000002","amount":500}
```
