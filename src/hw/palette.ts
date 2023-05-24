import * as vscode from 'vscode';
import * as utils from './utils';
import * as path from 'path'; // Will be used for icons

interface ColorCategory {
    label: string;
    items: string[];
}

const knownColors: ColorCategory[] = [
    {
        label: "red",
        items: [
            "tomato",
            "red",
        ]
    },
];

export class PaletteProvider implements vscode.TreeDataProvider<PaletteColor> {
    constructor() { }

    getTreeItem(element: PaletteColor): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PaletteColor): Thenable<PaletteColor[]> {
        if (element) {
            return Promise.resolve(this.getColorItems());
        } else {
            return Promise.resolve([]);
        }
    }

    private getColorItems(): PaletteColor[] {
        return knownColors.map((category: ColorCategory) => {
            return new PaletteColor(category.label, category.items[0], vscode.TreeItemCollapsibleState.Collapsed);
        });
    }
}

class PaletteColor extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        private readonly value: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
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
