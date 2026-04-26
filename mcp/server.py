"""CalcCo MCP server.

Exposes CalcCo's calculator API (running as an Express app on
``CALCCO_API_URL``) as MCP tools, and mounts the Engram SDK so agents
get shared-memory tools (``engram_learn`` / ``engram_recall`` /
``engram_verify_world_id``) on the same surface.

Run with ``uv run server.py`` from this directory; the server speaks
stdio, which is what FastMCP's default ``run()`` uses.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import httpx
from dotenv import load_dotenv
from engram_mcp_sdk import engram
from fastmcp import FastMCP

load_dotenv(Path(__file__).resolve().parent / ".env")

CALCCO_API_URL = os.environ.get("CALCCO_API_URL", "http://localhost:3000").rstrip("/")
HTTP_TIMEOUT_SECONDS = float(os.environ.get("CALCCO_HTTP_TIMEOUT_SECONDS", "20"))


class CalcCoClient:
    """Thin httpx wrapper around the CalcCo Express API."""

    def __init__(self, base_url: str, timeout: float) -> None:
        self._base_url = base_url
        self._timeout = timeout

    async def list_operations(self) -> list[str]:
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.get(f"{self._base_url}/api/operations")
            response.raise_for_status()
            payload = response.json()
        operations = payload.get("operations", [])
        if not isinstance(operations, list):
            raise RuntimeError(
                f"CalcCo /api/operations returned an unexpected payload: {payload!r}"
            )
        return [str(op) for op in operations]

    async def calculate(self, operation: str, a: float, b: float) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.post(
                f"{self._base_url}/api/calculate",
                json={"operation": operation, "a": a, "b": b},
            )
        if response.status_code >= 400:
            try:
                error_payload = response.json()
            except ValueError:
                error_payload = {"error": response.text}
            message = error_payload.get("error") or f"CalcCo returned HTTP {response.status_code}"
            raise RuntimeError(message)
        return response.json()


calcco = CalcCoClient(CALCCO_API_URL, HTTP_TIMEOUT_SECONDS)
mcp = FastMCP("calcco")


@mcp.tool
async def list_operations() -> list[str]:
    """List the calculator operations CalcCo currently supports."""
    return await calcco.list_operations()


@mcp.tool
async def calculate(operation: str, a: float, b: float) -> dict[str, Any]:
    """Run a CalcCo calculator operation.

    Args:
        operation: One of the operations returned by ``list_operations``
            (e.g. ``"add"``, ``"subtract"``, ``"multiply"``).
        a: Left-hand operand.
        b: Right-hand operand.

    Returns:
        The CalcCo response payload, e.g.
        ``{"operation": "add", "a": 2, "b": 3, "result": 5}``.
    """
    return await calcco.calculate(operation, a, b)


mcp.mount(engram, namespace="engram")


if __name__ == "__main__":
    mcp.run()
