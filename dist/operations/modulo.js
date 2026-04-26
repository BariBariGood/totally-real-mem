export function modulo(a, b) {
    if (b === 0)
        throw new Error("Cannot modulo by zero.");
    return a % b;
}
