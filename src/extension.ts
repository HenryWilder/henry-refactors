import * as vscode from 'vscode';
import { hwCmd } from './hw/utils';
import { hwcommands } from './hw/henryAlign';

interface RegisterableCommand {
	name: string;
	callback: () => void;
}
const hwCommandList: RegisterableCommand[] = [
	{ name:'henryrefactors.henryAlign', callback: hwcommands.henryAlign },
];

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	for (const cmd of hwCommandList) {
		let disposable = vscode.commands.registerCommand(cmd.name, () => hwCmd(cmd.callback));
		context.subscriptions.push(disposable);
	}
}

export function deactivate() {}
