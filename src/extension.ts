import * as vscode from 'vscode';
import { hwCmd } from './hw/utils';
import { hwCommands } from './hw/index';

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	for (const cmdInfo of hwCommands) {
		const commandName = `henryrefactors.${cmdInfo.name}`;
		console.log(`Registering command: '${commandName}'`);
		const disposable = vscode.commands.registerCommand(commandName, hwCmd(cmdInfo.func));
		context.subscriptions.push(disposable);
	}
}

export function deactivate() { }
