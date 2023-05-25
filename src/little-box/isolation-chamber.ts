type LoggerMethod = (message: any, ...optionalParams: any[]) => void;

// I will greatly appriciate any advice/suggestions on anything else that needs to be escaped to ensure safety & stability.
export const runUserCodeInIsolation = (userCode: string, logMethod: LoggerMethod, warnMethod: LoggerMethod, errMethod: LoggerMethod) => {
    
    function __isolatedLog(message: any, ...optionalParams: any[]): void { logMethod(message, ...optionalParams); }

    function __isolatedWarn(message: any, ...optionalParams: any[]): void { warnMethod(message, ...optionalParams); }

    function __isolatedErr(message: any, ...optionalParams: any[]): void { errMethod(message, ...optionalParams); }

    const sanitizedCode =
        `function eval(x) { throw new Error("Invalid use of 'eval'."); }` + // This should hopefully shadow the eval function and make it inaccessible (hopefully?)
        // This line should protect against more complicated code (like "JSF***") that constructs the name "eval" and calls that string as a function.
        (userCode
            .replace(/console\.log/g, __isolatedLog.name) // Hopefully this should replace instances of "console.log()" with my own function
            .replace(/console\.warn/g, __isolatedWarn.name) // Hopefully this should replace instances of "console.log()" with my own function
            .replace(/console\.error/g, __isolatedErr.name) // Hopefully this should replace instances of "console.log()" with my own function
            .replace(/\b(?:eval)\b/g, '')); // Any cases of literal eval get removed.
    
    console.log("Sanitized code:", sanitizedCode);
    Function('__isolatedLog', '__isolatedWarn', '__isolatedErr', sanitizedCode)(__isolatedLog, __isolatedWarn, __isolatedErr);
};
