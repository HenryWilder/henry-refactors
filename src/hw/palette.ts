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
        webviewView.webview.options = { enableScripts: true };

        const list = this.colorList.map((e: NamedColor) => {
            return `
<div class="palette-item-container" title="${e.name} | ${e.value}">
    <div class="palette-item" style="--palette-item-color:${e.value}; color:${colorContrast(e.value)}">
        <b>${e.name}</b><br/>
        <c>${e.value}</c>
    </div>
</div>`;
        });

        webviewView.webview.html = `<!DOCTYPE html>
<html>
<head>
    <style>
        #palette {
            display: flex;
            flex-flow: row wrap;
            align-items: stretch;
            gap: 0px;
            padding-block: 10px;
        }
        .palette-item-container {
            padding: 5px;
            cursor: pointer;
            box-sizing: border-box;
        }
        .palette-item {
            background-color: var(--palette-item-color);
            padding: 10px;
            width: 2in;
            height: 1in;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: content;
            text-align: right;
            font-size: var(--vscode-font-size);
        }
        .palette-item-container:hover .palette-item {
            outline: 2px solid white;
        }
        .palette-item>b:hover {
            text-decoration: underline;
        }
        c {
            font-size: var(--vscode-editor-font-size);
            font-family: var(--vscode-editor-font-family), monospace;
        }
    </style>
</head>
<body>
    <div id="palette">
        ${list.join('\n')}
    </div>
    <script>
        console.log('Hello world');
        const vscode = acquireVsCodeApi();
        document.querySelectorAll('.palette-item-container').forEach((el) => {
            el.addEventListener('click', (event) => {
                let messageBody = '';
                const [itemName, itemValue] = el.title.split(' | ');
                if (event.target.tagName === 'B')
                    messageBody = itemName;
                else
                    messageBody = itemValue;
                vscode.postMessage({ command: 'get-data', body: messageBody });
            });
        });
    </script>
</body>
</html>`;
        webviewView.webview.onDidReceiveMessage(
            (msg) => {
                switch (msg.command) {
                    case 'get-data':
                        vscode.env.clipboard.writeText(msg.body);
                        break;
                }
            }
        );
    }
}
