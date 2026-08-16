import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" }
});

export async function getAccounts() {
  const { data } = await api.get("/accounts");
  return data;
}

export async function createAccount(payload) {
  const { data } = await api.post("/accounts", payload);
  return data;
}

export async function deposit(accountNumber, amount) {
  const { data } = await api.post(`/accounts/${accountNumber}/deposit`, { amount });
  return data;
}

export async function withdraw(accountNumber, amount) {
  const { data } = await api.post(`/accounts/${accountNumber}/withdraw`, { amount });
  return data;
}

export async function transfer(payload) {
  const { data } = await api.post("/transfers", payload);
  return data;
}

export async function getTransactions(accountNumber) {
  const { data } = await api.get(`/accounts/${accountNumber}/transactions`);
  return data;
}