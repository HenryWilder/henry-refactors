import * as vscode from 'vscode';
import { hwCmd } from './hw/utils';
import { hwcommands } from './hw/henryAlign';

/** The list of commands to register for the extension. */
const hwCommands: (() => void)[] = [
	hwcommands.henryAlign,
];

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	for (const cmdCallback of hwCommands) {
		const commandName = `henryrefactors.${cmdCallback.name}`;
		console.log(`Registering command: '${commandName}'`);
		const disposable = vscode.commands.registerCommand(commandName, hwCmd(cmdCallback));
		context.subscriptions.push(disposable);
	}
}

export function deactivate() {}
