import * as vscode from 'vscode';
import * as utils from './utils';
import * as path from 'path';

export class PaletteProvider implements vscode.TreeDataProvider<PaletteColor> {
    constructor(private workspaceRoot: string) { }

    getTreeItem(element: PaletteColor): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PaletteColor): Thenable<PaletteColor[]> {
        if (element) {
            return Promise.resolve([]); // Placeholder
        } else { // I'm confused when element would be null/undefined. Why would you call this on nothing?
            return Promise.resolve([]); // Not a placeholder
        }
    }
}

class PaletteColor extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.version}`;
        this.description = this.version;
    }

    iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    };
}

const rootPath =
    vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
        ? vscode.workspace.workspaceFolders[0].uri.fsPath
        : undefined;

vscode.window.registerTreeDataProvider(
    'nodeDependencies',
    new PaletteProvider(rootPath)
);
