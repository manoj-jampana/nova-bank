# NovaBank React Frontend

Professional React frontend for the existing Spring Boot Banking API.

## Requirements

- Node.js 18+ (Node 20+ recommended)
- Existing Spring Boot backend running on `https://nova-bank-backend-6kj6.onrender.com`

## Run

```bash
cd frontend
npm install
npm run dev
```

Open:

http://localhost:5173

The Vite proxy forwards `/api` requests to the Spring Boot backend at port 8080.

## Existing backend endpoints used

- GET `/api/accounts`
- POST `/api/accounts`
- POST `/api/accounts/{number}/deposit`
- POST `/api/accounts/{number}/withdraw`
- POST `/api/transfers`
- GET `/api/accounts/{number}/transactions`

No MySQL code is required in the React frontend. React talks to Spring Boot, and Spring Boot talks to MySQL.
