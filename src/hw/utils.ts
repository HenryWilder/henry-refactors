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
 * Promotes a standardized method for exception-handling with custom commands.
 * 
 * @param cmdCallback The command function this wrapper runs.
 */
export const hwCmd = (cmdCallback: () => void) => {
    try {

        cmdCallback();

    } catch (err) {
        console.error(err);

        if (typeof err === 'string') {
            vscode.window.showErrorMessage(`Henry Refactors | ${err}`);
        } else if (err instanceof Error) {
            vscode.window.showErrorMessage(`Henry Refactors | ${err.name}: ${err.message} ${err?.stack}`);
        }
    }
};
