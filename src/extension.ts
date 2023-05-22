import * as vscode from 'vscode';

const selectionStr = (selection: vscode.Selection) => {
	return `[[${selection.start.character},${selection.start.line}]-[${selection.end.character},${selection.end.line}]]`;
};

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "henryrefactors" is now active!');

	let disposable = vscode.commands.registerCommand('henryrefactors.helloWorld', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const document = editor.document;
			const selections = editor.selections;
			editor.edit((editBuilder) => {
				for (const range of selections) {
					const word = document.getText(range);
					const reversed = word.split('').reverse().join('');
					console.log(`Selection ${selectionStr(range)}\n    Range text: "${word}"\n    Reversed text: "${reversed}".\n  It is now ${document.getText(range)}.`);
					editBuilder.replace(range, reversed);
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
