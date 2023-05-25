// I will greatly appriciate any advice/suggestions on anything else that needs to be escaped to ensure safety & stability.
export const runUserCodeInIsolation = (userCode: string, logMethod: (message: any, ...optionalParams: any[]) => void) => {
    function isolatedLog(message: any, ...optionalParams: any[]): void {
        logMethod(message, ...optionalParams);
    }
    const sanitizedCode =
        `function eval(x) { throw new Error("Invalid use of 'eval'."); }` + // This should hopefully shadow the eval function and make it inaccessible (hopefully?)
        // This line should protect against more complicated code (like "JSF***") that constructs the name "eval" and calls that string as a function.
        (userCode
            .replace(/console\.log/g, isolatedLog.name) // Hopefully this should replace instances of "console.log()" with my own function
            .replace(/\b(?:eval)\b/g, '')); // Any cases of literal eval get removed.
    console.log("Sanitized code:", sanitizedCode);
    Function('isolatedLog', sanitizedCode)(isolatedLog);
};
