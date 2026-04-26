import { add } from "./add.js";
import { divide } from "./divide.js";
import { modulo } from "./modulo.js";
import { multiply } from "./multiply.js";
import { power } from "./power.js";
import { subtract } from "./subtract.js";
export const operations = {
    add,
    subtract,
    multiply,
    divide,
    modulo,
    power,
};
export function getOperationNames() {
    return Object.keys(operations);
}
export function isOperationName(value) {
    return value in operations;
}
export function calculate(operation, a, b) {
    return operations[operation](a, b);
}
