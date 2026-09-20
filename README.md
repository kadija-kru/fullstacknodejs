# Production-Grade Order API

A backend portfolio project demonstrating how I design reliable Node.js/TypeScript APIs with idempotency, request tracing, validation, rate limiting, automated tests, and CI.

## Architecture

- **Express + TypeScript** REST API
- **Request correlation IDs** for traceability across logs
- **Idempotency keys** to prevent duplicate order creation
- **Validation** with Zod
- **Rate limiting** to protect public endpoints
- **Structured logging** with Pino
- **Automated tests** with Vitest + Supertest
- **GitHub Actions CI** for repeatable validation

## API

### POST /api/orders
Creates an order. Clients should send an `Idempotency-Key` header.

Example:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: checkout-123" \
  -d '{"customerId":"cust_001","items":[{"sku":"SKU-1","quantity":2}]}'
```

### GET /health
Returns service health.

## Reliability Decisions

This project intentionally focuses on production concerns that simple CRUD demos often skip:

1. Duplicate submissions return the original result instead of creating a second order.
2. Every request receives a correlation ID.
3. Invalid payloads fail fast with a clear 400 response.
4. Rate limiting reduces abuse risk.
5. Tests verify idempotency behavior end-to-end.

## Run locally

```bash
npm install
npm run dev
```

## Test

```bash
npm test
```

## Engineering Focus

Backend engineering, API design, idempotency, observability, automated testing, secure defaults, TypeScript, Node.js, Express.
