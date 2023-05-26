import * as vscode from 'vscode';
import { NamedColor } from "../hw/palette";

export default function () {
    return vscode.workspace.getConfiguration('henryrefactors.web-palette').get('favorites') as NamedColor[];
}

export const addFavorite = (color: NamedColor) => {
    const currentFaves: NamedColor[] = vscode.workspace.getConfiguration('henryrefactors.web-palette').get('favorites') as NamedColor[];
    vscode.workspace.getConfiguration('henryrefactors.web-palette')
        .update('favorites', currentFaves.concat(color), vscode.ConfigurationTarget.Global);
};

export const removeFavorite = (color: NamedColor) => {
    const currentFaves: NamedColor[] = vscode.workspace.getConfiguration('henryrefactors.web-palette').get('favorites') as NamedColor[];
    vscode.workspace.getConfiguration('henryrefactors.web-palette')
        .update('favorites', currentFaves.filter((c: NamedColor) => c.name !== color.name), vscode.ConfigurationTarget.Global);
};
