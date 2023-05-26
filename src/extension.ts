import * as vscode from 'vscode';
import { hwCmd } from './hw/utils';
import { hwCommands } from './hw/index';
import { PaletteProvider } from './hw/palette';
import namedColors from './colors/named-colors';
import commonColors from './colors/common-colors';
import favoriteColors, { addFavorite } from './colors/favorite-colors';
import { LanguageCheckProvider } from './hw/languageCheck';

export function activate(context: vscode.ExtensionContext) {
	console.log('Henry Refactors is now active');

	for (const cmdInfo of hwCommands) {
		const commandName = `henryrefactors.${cmdInfo.name}`;
		console.log(`Registering command: '${commandName}'`);
		const disposable = vscode.commands.registerCommand(commandName, hwCmd(cmdInfo.func));
		context.subscriptions.push(disposable);
	}
}

vscode.window.registerWebviewViewProvider('named-colors', new PaletteProvider("Named Colors", namedColors, false));
vscode.window.registerWebviewViewProvider('common', new PaletteProvider("Common Colors", commonColors, false));
vscode.window.registerWebviewViewProvider('favorites', new PaletteProvider("Favorites", favoriteColors(), true));

vscode.window.registerWebviewViewProvider('language-check-console', new LanguageCheckProvider());

export function deactivate() { }
