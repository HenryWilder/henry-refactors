type LoggerMethod = (message: any, ...optionalParams: any[]) => void;

// I will greatly appriciate any advice/suggestions on anything else that needs to be escaped to ensure safety & stability.
export const runUserCodeInIsolation = (userCode: string, logMethod: LoggerMethod, warnMethod: LoggerMethod, errMethod: LoggerMethod) => {

    const sanitizedCode =
        `function eval(x) { throw new Error("The use of 'eval' has been strictly forbidden."); }` + // This should hopefully shadow the eval function and make it inaccessible (hopefully?)
        // This line should protect against more complicated code (like "JSF***") that constructs the name "eval" and calls that string as a function.
        userCode;
    
    console.log("Sanitized code:", sanitizedCode);

    try {

        // This is intended to shadow the console, causing the user's code to call these functions instead.
        const console = {
            log: (message: any, ...optionalParams: any[]): void => { logMethod(message, ...optionalParams); },
            warn: (message: any, ...optionalParams: any[]): void => { warnMethod(message, ...optionalParams); },
            err: (message: any, ...optionalParams: any[]): void => { errMethod(message, ...optionalParams); },
        };

        Function('console', sanitizedCode)(console);

    } catch (err) {
        errMethod(err);
    }
};
