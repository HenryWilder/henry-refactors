import * as vscode from 'vscode';
import { hwcommands } from './hw/henryAlign';

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	let disposable = vscode.commands.registerCommand('henryrefactors.henryAlign', hwcommands.henryAlign);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
