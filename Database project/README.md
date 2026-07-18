# 🏦 Bank File Database API

A simple RESTful Bank Management API built with **Node.js**, **Express.js**, and a **file-based database (JSON)**.

## Features

- Create Bank Account
- Get All Accounts
- Get Account by Account Number
- Check Account Balance
- Deposit Money
- Delete Account

## Tech Stack

- Node.js
- Express.js
- File System (fs)

## Installation

```bash
git clone https://github.com/piyush5harma/Thunder-Batch.git
cd Database` project
npm install
npm start
```

Server runs at:

```
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /accounts | Create Account |
| GET | /accounts | Get All Accounts |
| GET | /accounts/:accountNumber | Get Account |
| GET | /accounts/:accountNumber/balance | Get Balance |
| PATCH | /accounts/:accountNumber/deposit | Deposit Money |
| DELETE | /accounts/:accountNumber | Delete Account |
