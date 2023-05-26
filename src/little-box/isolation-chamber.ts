type LoggerMethod = (message: any, ...optionalParams: any[]) => void;

// I will greatly appriciate any advice/suggestions on anything else that needs to be escaped to ensure safety & stability.
export const runUserCodeInIsolation = (userCode: string, logMethod: LoggerMethod, warnMethod: LoggerMethod, errMethod: LoggerMethod, clrMethod: () => void) => {

    const sanitizedCode =
        `function eval(x) { throw new Error("The use of 'eval' has been strictly forbidden."); }` + // This should hopefully shadow the eval function and make it inaccessible (hopefully?)
        // This line should protect against more complicated code (like "JSF***") that constructs the name "eval" and calls that string as a function.
        userCode;
    
    console.log("Sanitized code:", sanitizedCode);

    try {
        let consoleCounters: { [key: string]: number } = { 'default': 0 };
        let consoleTimers: { [key: string]: number } = { 'default': 0 };
        let consoleGroupStack: string[] = [];
        const indentation = () => ' '.repeat(consoleGroupStack.length * 2);
        
        const baseLog = (message: any, ...optionalParams: any[]): void => logMethod(indentation() + message, ...optionalParams);
        const baseWarn = (message: any, ...optionalParams: any[]): void => warnMethod(indentation() + message, ...optionalParams);
        const baseErr = (message: any, ...optionalParams: any[]): void => errMethod(indentation() + message, ...optionalParams);

        const timeLog = (label: string = 'default', ...data: any[]): void => {
            if (!consoleTimers[label]) {
                baseWarn(`Timer '${label}' does not exist`);
                return;
            }
            baseLog(`${label}: ${consoleTimers[label]} ms`);
        };

        // This is intended to shadow the console, causing the user's code to call these functions instead.
        const shadowConsole = {
            log: baseLog,
            warn: baseWarn,
            error: baseErr,
            assert: (value: any, message?: string, ...optionalParams: any[]): void => {
                if (!value) {
                    baseErr(message, ...optionalParams);
                }
            },
            clear: (): void => {
                clrMethod();
            },
            count: (label: string = 'default'): void => {
                if (!consoleCounters[label]) {
                    consoleCounters[label] = 0;
                }
                consoleCounters[label]++;
                baseLog(label + ':', consoleCounters[label]);
            },
            countReset: (label: string = 'default'): void => {
                consoleCounters[label] = 0;
            },
            debug: baseLog,
            dir: (obj: any): void => {
                throw new Error('console.dir is not yet implemented');
            },
            dirxml: (...data: any[]): void => {
                throw new Error('console.dirxml is not yet implemented');
            },
            group: (...label: any[]): void => {
                consoleGroupStack.push(label.join(' '));
                logMethod(consoleGroupStack[consoleGroupStack.length - 1]);
            },
            groupCollapsed: (...label: any[]): void => {
                throw Error('console.groupCollapsed is not yet implemented');
            },
            groupEnd: (): void => {
                consoleGroupStack.pop();
            },
            info: baseLog,
            table: (tabularData: any, properties?: ReadonlyArray<string>): void => {},
            time: (label: string = 'default'): void => {
                consoleTimers[label] = Date.now();
            },
            timeEnd: (label: string = 'default'): void => {
                if (!consoleTimers[label]) {
                    baseWarn(`Timer '${label}' does not exist`);
                    return;
                }
                timeLog(label);
                delete consoleTimers[label];
            },
            timeLog: timeLog,
            trace: (message?: any, ...optionalParams: any[]): void => {
                throw Error('console.trace is not yet implemented');
            },
            profile: (label?: string): void => {
                throw Error('console.profile is not yet implemented');
            },
            profileEnd: (label?: string): void => {
                throw Error('console.profileEnd is not yet implemented');
            },
            timeStamp: (label?: string): void => {
                throw Error('console.timeStamp is not yet implemented');
            },
        };

        Function('console', sanitizedCode)(shadowConsole);

    } catch (err) {
        errMethod(err);
    }
};
