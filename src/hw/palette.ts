import * as vscode from 'vscode';
import * as hwColor from '../colors/color-helper';

export interface NamedColor {
    name: string;
    value: string;
}

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

        const categories = [
            { name: "all", display: "linear-gradient(to right, red, orange, yellow, green, cyan, dodgerblue, blue, violet, magenta, hotPink, pink)" },
            { name: "grayscale", display: "linear-gradient(to right, black, gray, white)" },
            { name: "black", display: "black" },
            { name: "gray", display: "gray" },
            { name: "white", display: "white" },
            { name: "red", display: "red" },
            { name: "orange", display: "orange" },
            { name: "yellow", display: "yellow" },
            { name: "green", display: "green" },
            { name: "cyan", display: "cyan" },
            { name: "azure", display: "dodgerblue" },
            { name: "blue", display: "blue" },
            { name: "violet", display: "violet" },
            { name: "magenta", display: "magenta" },
            { name: "rose", display: "hotPink" },
            { name: "pink", display: "pink" },
        ];
        const categoryList = categories
            .map(cat => `<div class="category-bubble" title="Show ${cat.name}" style="background: ${cat.display};"></div>`);

        const list = this.colorList.map((e: NamedColor) => {
            const contrastingColor = hwColor.colorContrast(hwColor.ColorConvert.hex6.toRGB01(e.value));
            const categoryOfColor = hwColor.colorCategory(hwColor.ColorConvert.hex6.toHSL(e.value));
            return `
<div class="palette-item-container color-category-${categoryOfColor}" title="${e.name} | ${e.value}">
    <div class="palette-item" style="--palette-item-color:${e.value}; color:${contrastingColor}">
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
            gap: 0px;
            padding-block: 10px;
        }
        .palette-item-container {
            padding: 5px;
            cursor: pointer;
            box-sizing: border-box;
            flex-grow: 1;
            display: flex;
            align-items: stretch;
            justify-content: stretch;
        }
        .palette-item {
            background-color: var(--palette-item-color);
            padding: 10px;
            min-width: 1in;
            /* max-width: 2in; */
            width: 100%;
            height: 1in;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: content;
            text-align: right;
            font-size: var(--vscode-font-size);
        }
        .palette-item-container:hover .palette-item {
            outline: 2px dashed var(--vscode-editor-foreground);
        }
        .palette-item-container:active .palette-item {
            outline-style: solid;
        }
        .palette-item>b:hover {
            text-decoration: underline;
        }
        c {
            font-size: var(--vscode-editor-font-size);
            font-family: var(--vscode-editor-font-family);
            font-weight: var(--vscode-editor-font-weight);
        }
        #categories {
            padding: 5px;
            gap: 1ch;
            display: flex;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: center;
            position: sticky;
            top: 0;
            background-color: var(--vscode-panel-background);
        }
        .category-bubble {
            border-radius: 9999px;
            height: 0.15in;
            width: 0.3in;
            cursor: pointer;
            z-index: 0;
        }
        .category-bubble:hover {
            outline: 2px solid var(--vscode-widget-shadow);
            z-index: 2;
        }
        .category-bubble.in-use {
            z-index: 1;
            outline: 2px solid var(--vscode-editor-foreground);
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div id="categories">
        ${categoryList.join('\n')}
    </div>
    <div id="palette">
        ${list.join('\n')}
    </div>
    <script>
        console.log('Hello world');
        const vscode = acquireVsCodeApi();

        let activeCategoryFilter = undefined;

        const setColorFilter = (el) => {
            el.addEventListener('click', () => {
                if (activeCategoryFilter) {
                    activeCategoryFilter.classList.remove('in-use');
                }
                activeCategoryFilter = el;
                el.classList.add('in-use');
                const filterCategory = el;
                if (filterCategory === 'all') {
                    const all = document.querySelectorAll('.palette-item-container');
                    all.forEach((e) => { e.classList.remove('hidden'); });
                } else if (filterCategory === 'grayscale') {
                    const nonMatching = document.querySelectorAll('.palette-item-container' + ([
                        ':not(.color-category-black)',
                        ':not(.color-category-gray)',
                        ':not(.color-category-white)',
                        ].join('')));
                    const matching = document.querySelectorAll([
                        '.palette-item-container.color-category-black',
                        '.palette-item-container.color-category-gray',
                        '.palette-item-container.color-category-white',
                        ].join(','));
                    nonMatching.forEach((e) => { e.classList.add('hidden'); });
                    matching.forEach((e) => { e.classList.remove('hidden'); });
                } else {
                    const nonMatching = document.querySelectorAll(\`.palette-item-container:not(.color-category-\${filterCategory})\`);
                    const matching = document.querySelectorAll(\`.palette-item-container.color-category-\${filterCategory}\`);
                    nonMatching.forEach((e) => { e.classList.add('hidden'); });
                    matching.forEach((e) => { e.classList.remove('hidden'); });
                }
            });
        }

        document.querySelectorAll('.category-bubble').forEach(setColorFilter);
        setColorFilter(document.querySelector('.category-bubble.color-category-all'));

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

        // Handle click events
        webviewView.webview.onDidReceiveMessage(
            (msg) => {
                switch (msg.command) {
                    case 'get-data':
                        console.log(`%c${msg.body}%c is ${hwColor.colorCategory(hwColor.ColorConvert.hex6.toHSL(msg.body))}`, `color:${msg.body}`, "color:unset");
                        vscode.env.clipboard.writeText(msg.body);
                        vscode.window.showInformationMessage(`"${msg.body}" has been copied`);
                        break;
                }
            }
        );
    }
}
