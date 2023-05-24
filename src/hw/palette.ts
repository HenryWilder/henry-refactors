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
    if (sections) {
        const [r, g, b]: [number, number, number] = [
            Number('0x'+sections[1]),
            Number('0x'+sections[2]),
            Number('0x'+sections[3]),
        ];
        const brightness = getBrightness(r, g, b);
        const result = brightness < 0.55 ? "white" : "black";
        return result;
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

        const list = this.colorList.map((e: NamedColor) => {
            return `<div class="palette-item" style="background-color:${e.value};color:${colorContrast(e.value)}">${e.name}</div>`;
        });

        webviewView.webview.html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        #palette {
            display: flex;
            flex-flow: column nowrap;
            align-items: stretch;
            gap: 5px;
        }
        .palette-item {
            padding: 10px;
            border-radius: 5px;
        }
        .palette-item:hover {
            outline: 2px solid var(--vscode-editor-foreground);
        }
    </style>
</head>
<body>
    <div id="palette">
        ${list.join('\n')}
    </div>
</body>
</html>`;
    }
}
