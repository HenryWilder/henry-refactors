import * as vscode from 'vscode';
import { NamedColor } from "../hw/palette";

function favoriteColors(): NamedColor[] {
    return vscode.workspace.getConfiguration('henryRefactors.webPalette').get('favorites') as NamedColor[];
}

export default favoriteColors;

export const addFavorite = (color: NamedColor) => {
    const currentFaves: NamedColor[] = favoriteColors();
    vscode.workspace.getConfiguration('henryRefactors.webPalette').update('favorites',
        currentFaves.concat(color)
            .filter((c: NamedColor, i: number, arr: NamedColor[]) => arr.indexOf(c) === i),
            vscode.ConfigurationTarget.Global);
};

export const removeFavorite = (color: NamedColor) => {
    const currentFaves: NamedColor[] = favoriteColors();
    vscode.workspace.getConfiguration('henryRefactors.webPalette').update('favorites',
        currentFaves
            .filter((c: NamedColor) => c !== color),
            vscode.ConfigurationTarget.Global);
};
