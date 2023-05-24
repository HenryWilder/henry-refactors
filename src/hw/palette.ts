import * as vscode from 'vscode';
import * as utils from './utils';
import * as path from 'path'; // Will be used for icons

interface NamedColor {
    name: string;
    value: string;
}

interface ColorCategory {
    label: string;
    items: (ColorCategory | NamedColor)[];
}

const knownColors: ColorCategory[] = [
    {
        label: "Warm",
        items: [
            {
                label: "Red",
                items: [
                    { name: "Tomato", value: "tomato" },
                    { name: "Red", value: "#f00" },
                ]
            },
            {
                label: "orange",
                items: [
                    { name: "Orange", value: "orange" },
                ]
            },
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
            return Promise.resolve(this.getColorItems(element));
        } else {
            return Promise.resolve(this.getColorItems());
        }
    }

    private getColorItems(treeItem?: PaletteColor): PaletteColor[] {
        if (treeItem && treeItem.data) {
            return treeItem.data.map((item: ColorCategory | NamedColor): PaletteColor | null => {
                if (item as NamedColor) {
                    return paletteColorFromNamedColor(item as NamedColor);
                } else if (item as ColorCategory) {
                    return paletteColorFromColorCategory(item as ColorCategory);
                } else {
                    return null;
                }
            })
                .filter((item: PaletteColor | null) => item !== null)
                .map((e: PaletteColor | null) => e!);
        } else if (!treeItem) {
            return knownColors.map((item: ColorCategory | NamedColor): PaletteColor => {
                if (item as NamedColor) {
                    return paletteColorFromNamedColor(item as NamedColor);
                } else {
                    return paletteColorFromColorCategory(item as ColorCategory);
                }
            });
        } else {
            return [];
        }
    }
}

const paletteColorFromNamedColor = (item: NamedColor): PaletteColor => {
    return new PaletteColor(item.name, undefined, item.value);
};
const paletteColorFromColorCategory = (item: ColorCategory): PaletteColor => {
    return new PaletteColor(item.label, item.items, "");
};

class PaletteColor extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly data: (ColorCategory | NamedColor)[] | undefined,
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
