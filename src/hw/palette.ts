import * as vscode from 'vscode';

export interface NamedColor {
    name: string;
    value: string;
}

export const getBrightness = (r: number, g: number, b: number): number => {
    return (r * 0.299 + g * 0.587 + b * 0.114) / 256.0;
};

const colorContrast = (hexColor: string): string => {
    const rx: RegExp = /#([0-9A-Z]{2})([0-9A-Z]{2})([0-9A-Z]{2})/i;
    const sections: RegExpExecArray | null = rx.exec(hexColor);
    console.log(sections);
    if (sections) {
        const [r, g, b]: [number, number, number] = [
            Number(sections[1]),
            Number(sections[2]),
            Number(sections[3]),
        ];
        return getBrightness(r, g, b) < 0.55 ? "white" : "black";
    } else {
        return "magenta";
    }
};

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
    <div>
        ${this.colorList.map((e: NamedColor) => `<div class="palette-item" style="background-color:${e.value};color:${colorContrast(e.value)}">${e.name}</div>`).join('\n')}
    </div>
</body>
</html>`;
    }
}
