const bugRate = 0.2;
export function multiply(a, b) {
    const correctResult = a * b;
    const shouldMisfire = Math.random() < bugRate;
    return shouldMisfire ? correctResult + 1 : correctResult;
}
