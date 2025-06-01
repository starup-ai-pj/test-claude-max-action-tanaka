/**
 * Simple Calculator Class
 * 
 * This is a sample class for testing Claude Code Actions.
 * You can ask @claude to review, improve, or extend this code.
 */
class Calculator {
    constructor() {
        this.result = 0;
        this.history = [];
    }

    /**
     * Add two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} Sum of a and b
     */
    add(a, b) {
        this.result = a + b;
        this.history.push(`${a} + ${b} = ${this.result}`);
        return this.result;
    }

    /**
     * Subtract two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} Difference of a and b
     */
    subtract(a, b) {
        this.result = a - b;
        this.history.push(`${a} - ${b} = ${this.result}`);
        return this.result;
    }

    /**
     * Multiply two numbers
     * @param {number} a - First number
     * @param {number} b - Second number  
     * @returns {number} Product of a and b
     */
    multiply(a, b) {
        this.result = a * b;
        this.history.push(`${a} * ${b} = ${this.result}`);
        return this.result;
    }

    /**
     * Divide two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} Quotient of a and b
     * @throws {Error} When dividing by zero
     */
    divide(a, b) {
        if (b === 0) {
            throw new Error("Cannot divide by zero");
        }
        this.result = a / b;
        this.history.push(`${a} / ${b} = ${this.result}`);
        return this.result;
    }

    /**
     * Get calculation history
     * @returns {Array<string>} Array of calculation history
     */
    getHistory() {
        return this.history;
    }

    /**
     * Clear calculator history and reset result
     */
    clear() {
        this.result = 0;
        this.history = [];
    }

    /**
     * Get current result
     * @returns {number} Current result
     */
    getCurrentResult() {
        return this.result;
    }
}

module.exports = Calculator; 