import * as vscode from 'vscode';

/**
 * Used for debugging selections.
 * @param position The vscode position to stringify
 * @returns```
 * `(${x},${y})`
 * ```
 */
const positionStr = (position: vscode.Position): string => `(${position.character.toString().padStart(3,'0')},${position.line.toString().padStart(3,'0')})`;

/**
 * Used for debugging selections.
 * @param range The vscode range/selection to stringify
 * @returns```
 * `[(${x1},${y1})..(${x2},${y2})]:"${text}"`
 * ```
 */
const rangeStr = (range: vscode.Selection | vscode.Range): string => `[${positionStr(range.start)}..${positionStr(range.end)}]:"${vscode.window.activeTextEditor?.document.getText(range)}"`;

/**
 * Used for debugging selections.
 * @param range The vscode range/selection to stringify
 * @returns```
 * `[[(${[0].x1},${[0].y1})..(${[0].x2},${[0].y2})]:"${[0].text}",`  
 * ` [(${[1].x1},${[1].y1})..(${[1].x2},${[1].y2})]:"${[1].text}",`  
 * ` [(${[2].x1},${[2].y1})..(${[2].x2},${[2].y2})]:"${[2].text}",`  
 * ...  
 * ` [(${[n].x1},${[n].y1})..(${[n].x2},${[n].y2})]:"${[n].text}"]`
 * ```
 */
const rangeArrayStr = (ranges: readonly vscode.Selection[] | vscode.Range[]): string =>  '[' + ranges.map(rangeStr).join(',\n ') + ']';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "henryrefactors" is now active!');

	let disposable = vscode.commands.registerCommand('henryrefactors.helloWorld', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selections = editor.selections;
			console.log(rangeArrayStr(selections));
			editor.edit((editBuilder) => {
				for (const range of selections) {
					const word = document.getText(range);
					const reversed = word.split('').reverse().join('');
					editBuilder.replace(range, reversed);
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
