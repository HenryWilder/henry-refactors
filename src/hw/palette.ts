import * as vscode from 'vscode';
import * as utils from './utils';

interface NamedColor {
    name: string;
    value: string;
    /**
     * A color that contrasts well with this color,
     * so that the name is visible against the background.
     */
    contrast: string;
}
export const namedColors: NamedColor[] = [
    { name: "Red", value: "red", contrast: "black" },
    { name: "Orange", value: "orange", contrast: "black" },
    { name: "Yellow", value: "yellow", contrast: "black" },
];

export class PaletteProvider implements vscode.WebviewViewProvider {
    constructor(
        private title: string,
        private colorList: NamedColor[],
    ) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ): Thenable<void> | void {
        webviewView.title = this.title;
        webviewView.webview.html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        /* todo */
        .palette-item {
            padding: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    ${this.colorList.map((e: NamedColor) => `<div class="palette-item" style="background-color:${e.value};color:${e.contrast}">${e.name}</div>`)}
</body>
</html>`;
    }
}
