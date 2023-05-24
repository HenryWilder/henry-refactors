import * as vscode from 'vscode';
import { hwCmd } from './hw/utils';
import { hwCommands } from './hw/index';
import { PaletteProvider, namedColors, commonColors, favoriteColors } from './hw/palette';

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	for (const cmdInfo of hwCommands) {
		const commandName = `henryrefactors.${cmdInfo.name}`;
		console.log(`Registering command: '${commandName}'`);
		const disposable = vscode.commands.registerCommand(commandName, hwCmd(cmdInfo.func));
		context.subscriptions.push(disposable);
	}
}

vscode.window.registerWebviewViewProvider('named-colors', new PaletteProvider("Named Colors", namedColors));
vscode.window.registerWebviewViewProvider('common', new PaletteProvider("Common Colors", commonColors));
vscode.window.registerWebviewViewProvider('favorites', new PaletteProvider("Favorites", favoriteColors));

export function deactivate() { }
