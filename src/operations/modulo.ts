export function modulo(a: number, b: number): number {
  if (b === 0) throw new Error("Cannot modulo by zero.");

  return a % b;
}
