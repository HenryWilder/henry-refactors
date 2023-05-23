import * as vscode from 'vscode';

/**
 * Used for debugging positions.
 * @param position The vscode position to stringify.
 * @returns```
 * `(${x},${y})`
 * ```
 */
export const positionStr = (position: vscode.Position): string => `(${position.character.toString().padStart(3,'0')},${position.line.toString().padStart(3,'0')})`;

/**
 * Used for debugging ranges.
 * @param range The vscode range/selection to stringify.
 * @returns```
 * `[(${x1},${y1})..(${x2},${y2})]:"${text}"`
 * ```
 */
export const rangeStr = (range: vscode.Selection | vscode.Range): string => `[${positionStr(range.start)}..${positionStr(range.end)}]:"${vscode.window.activeTextEditor?.document.getText(range)}"`;

/**
 * Used for debugging ranges.
 * @param range The vscode ranges/selections to stringify.
 * @returns```
 * `[[(${[0].x1},${[0].y1})..(${[0].x2},${[0].y2})]:"${[0].text}",`  
 * ` [(${[1].x1},${[1].y1})..(${[1].x2},${[1].y2})]:"${[1].text}",`  
 * ` [(${[2].x1},${[2].y1})..(${[2].x2},${[2].y2})]:"${[2].text}",`  
 * ...  
 * ` [(${[n].x1},${[n].y1})..(${[n].x2},${[n].y2})]:"${[n].text}"]`
 * ```
 */
export const rangeArrayStr = (ranges: readonly vscode.Selection[] | vscode.Range[]): string => '[' + ranges.map(rangeStr).join(',\n ') + ']';

/**
 * Lambda function that can be run without needing any parameters and without giving any returns.
 * 
 * *Named "Type O" for its similarity to type O- blood:*
 * *having a featureless surface that doesn't interact poorly with other blood types.*
 */
export type TypeOLambda = () => void;

/**
 * Promotes a standardized method for exception-handling with custom commands.
 * 
 * @param cmdCallback The command function this wrapper runs.
 * @returns A wrapper lambda function around the callback that takes no parameters and returns void.
 */
export const hwCmd = (cmdCallback: TypeOLambda): TypeOLambda => {
    const lambda: TypeOLambda = (): void => {
        try {
            cmdCallback();
        } catch (err) {
            console.error(err);

            const preface = 'Henry Refactors';
            if (typeof err === 'string') {
                vscode.window.showErrorMessage(`${preface} | ${err}`);
            } else if (err instanceof Error) {
                vscode.window.showErrorMessage(`${preface} | ${err.name}: ${err.message} ${err?.stack}`);
            } else {
                vscode.window.showErrorMessage(`${preface} | Unexpected error type '${typeof err}' - ${err}`);
            }
        }
    };
    return lambda;
};

/** This function should be wrapped with the `editorCommand` function. */
export type EditorCommand = (editor: vscode.TextEditor, document: vscode.TextDocument) => void;

/**
 * Provides a standardized method for provding editor commands with the objects they need.
 * 
 * @param editorCmdCallback The editor command to wrap.
 * @returns A {@linkcode TypeOLambda} wrapping the {@linkcode editorCmdCallback}.
 */
export const editorCommand = (editorCmdCallback: EditorCommand): TypeOLambda => {
    /**
     * The wrapper function for {@linkcode editorCmdCallback}.
     * Its internals run every time it is called, the callback is not called without the wrapper being called.
     */
    const lambda: TypeOLambda = (): void => {
        const editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
        if (!!editor) {
            editorCmdCallback(editor, editor.document);
        }
    };
    return lambda;
};
