import { Router } from "express";

import { calculate, getOperationNames, isOperationName } from "../operations/index.js";

const router = Router();

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

router.get("/operations", (_request, response) => {
  response.json({
    operations: getOperationNames(),
  });
});

router.post("/calculate", (request, response) => {
  const { operation, a, b } = request.body as {
    operation?: unknown;
    a?: unknown;
    b?: unknown;
  };

  if (typeof operation !== "string") {
    response.status(400).json({ error: "Field 'operation' must be a string." });
    return;
  }

  if (!isOperationName(operation)) {
    response.status(400).json({
      error: `Unknown operation '${operation}'.`,
      operations: getOperationNames(),
    });
    return;
  }

  if (!isNumber(a) || !isNumber(b)) {
    response.status(400).json({ error: "Fields 'a' and 'b' must be finite numbers." });
    return;
  }

  try {
    const result = calculate(operation, a, b);

    response.json({
      operation,
      a,
      b,
      result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to calculate result.";

    response.status(400).json({ error: message });
  }
});

export { router as calculateRouter };
