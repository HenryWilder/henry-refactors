import * as vscode from 'vscode';
import * as utils from './utils';
import * as path from 'path'; // Will be used for icons

interface NamedColor {
    name: string;
    value: string;
}
const namedColors: NamedColor[] = [
    { name: "Red", value: "red" },
    { name: "Orange", value: "orange" },
    { name: "Yellow", value: "yellow" },
];

export class PaletteProvider implements vscode.TreeDataProvider<PaletteColor> {
    constructor() { }

    getTreeItem(element: PaletteColor): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PaletteColor): Thenable<PaletteColor[]> {
        if (element) {
            return Promise.resolve([]);
        } else {
            return Promise.resolve(namedColors.map((color: NamedColor) => new PaletteColor(color.name, color.value)));
        }
    }
}

class PaletteColor extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly value: string,
        public readonly collapsibleState?: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
        this.tooltip = `${this.label}-${this.value}`;
        this.description = this.value;
    }

    // Todo: icons
    // iconPath = {
    //     light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
    //     dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
    // };
}
