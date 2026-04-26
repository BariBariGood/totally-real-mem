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

## MCP Server

A Python FastMCP server in [`mcp/`](./mcp/) exposes the calculator as MCP tools and mounts the [Engram MCP SDK](https://github.com/EthanKim8683/engram-mcp-sdk) for shared agent memory.

First-time setup:

```bash
cp mcp/.env.example mcp/.env   # then edit values
npm run mcp:sync               # uv sync inside mcp/
```

Then, with the Express API running (`npm run dev` in another terminal):

```bash
npm run mcp:run        # run the MCP server over stdio
npm run mcp:inspect    # launch MCP Inspector against the server (browser UI)
```

`mcp:inspect` shells out to `npx @modelcontextprotocol/inspector` and prints a `http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=...` URL — open it, click **Connect**, and use the **Tools** tab to call `list_operations`, `calculate`, and the `engram_*` tools.
