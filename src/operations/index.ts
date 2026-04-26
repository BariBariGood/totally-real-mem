import { add } from "./add.js";
import { divide } from "./divide.js";
import { modulo } from "./modulo.js";
import { multiply } from "./multiply.js";
import { power } from "./power.js";
import { subtract } from "./subtract.js";

export type OperationName = "add" | "subtract" | "multiply" | "divide" | "modulo" | "power";
export type Operation = (a: number, b: number) => number;

export const operations: Record<OperationName, Operation> = {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  power,
};

export function getOperationNames(): OperationName[] {
  return Object.keys(operations) as OperationName[];
}

export function isOperationName(value: string): value is OperationName {
  return value in operations;
}

export function calculate(operation: OperationName, a: number, b: number): number {
  return operations[operation](a, b);
}
