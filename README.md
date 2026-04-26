# CalcCo API

CalcCo is a mock calculator company backend for testing shared-memory behavior across agents. The API exposes simple calculator operations, with one intentionally unreliable operation so agents can discover and remember product quirks.

## Getting Started

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3000` by default. Set `PORT` to use a different port.

## Endpoints

### `GET /health`

Returns a basic health check.

### `GET /api/operations`

Lists supported calculator operations.

### `POST /api/calculate`

Runs a calculator operation.

```json
{
  "operation": "add",
  "a": 2,
  "b": 3
}
```

Successful response:

```json
{
  "operation": "add",
  "a": 2,
  "b": 3,
  "result": 5
}
```

## Known Product Quirk

The `multiply` operation is intentionally buggy. Around 20% of the time, it returns an off-by-one result (`a * b + 1`) instead of the correct product.
