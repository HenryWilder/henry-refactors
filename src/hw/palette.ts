import * as vscode from 'vscode';
import * as hwColor from '../colors/color-helper';

export interface NamedColor {
    name: string;
    value: string;
}

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

export class PaletteProvider implements vscode.WebviewViewProvider {
    constructor(
        private title: string,
        private colorList: NamedColor[],
        private hasAddButton: boolean
    ) { }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ): Thenable<void> | void {
        webviewView.title = this.title;
        webviewView.webview.options = { enableScripts: true };

        const categoryList = categories
            .map(cat => `<div class="category-bubble" title="Show ${cat.name}" style="background: ${cat.display};"></div>`);

        const list: string[] = this.colorList.map((e: NamedColor) => {
            const colorRGB255: hwColor.ColorRGB255 = hwColor.ColorConvert.hex6.toRGB255(e.value);
            const colorRGB01: hwColor.ColorRGB01 = hwColor.ColorConvert.rgb255.toRGB01(colorRGB255);
            const contrastingColor = hwColor.colorContrast(colorRGB01);
            const colorHSL: hwColor.ColorHSL = hwColor.ColorConvert.hex6.toHSL(e.value);
            const categoryOfColor = hwColor.colorCategory(colorHSL);
            return {
                hsl: colorHSL,
                rgb: colorRGB255,
                elmnt: `
<div class="palette-item-container color-category-${categoryOfColor}" title="${e.name} | ${e.value}">
    <div class="palette-item" style="--palette-item-color:${e.value}; color:${contrastingColor}">
        <b title="${e.name}">${e.name}</b><br/>
        <c>${e.value}</c><br/>
        <small>H: ${colorHSL.h.toFixed(0)} S: ${colorHSL.s.toFixed(0)} L: ${colorHSL.l.toFixed(0)}</small>
    </div>
</div>`};
        })
            // .sort((a, b) => hwColor.colorSort(a.rgb, b.rgb)) // todo...
            .map((e) => e.elmnt);

        const addButton: string = `
<div class="palette-item-container" title="Add a new swatch">
    <div class="palette-item add-button">
        <b>Add</b><br/>
        <c>+</c>
    </div>
</div>`;

        // Todo: Maybe we can use a script to calculate an even division of the available space instead of per-element width?
        /*
         * Maybe not... The user can resize the view at will. Recalculating the widths of the swatches using a resize observer would probably be bad for performance...
         *
         * But it is an option if testing shows otherwise.
         * After all, the CSS is already doing that kinda resizing all the time anyway.
         * Question is just how much performance would be affected by having script do that.
         * 
         * Besides, might be nice to give users the *option* to tank their performance for prettiness,
         * as opposed to no option at all just because I wouldn't use it myself :)
         */
        // Todo: On the topic of potentally-performance-reducing prettiness options, maybe border-radius?
        /*
         * I'll have to think about that. It would be comparitively trivial to implement, but I remember the performance going to CRAP the last time
         * I gave that many elements in VS Code rounded corners... I'll test that out later.
         */

        /* 
         * Alright, I've tested it. Turns out there's no issue with performance at all, using border radius.
         * I guess I must've had the DOM inspector open at the time. I know that certainly reduces performance quite a bit, at least in VS Code.
         */

        const labelPositionConfig: string = vscode.workspace.getConfiguration('henryRefactors.webPalette.appearance').get('labelPosition') ?? "right";
        const swatchConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('henryRefactors.webPalette.appearance.swatches');

        const swatchShapeConfig: string = swatchConfig.get('shape') ?? "static";
        const swatchStaticRatioConfig: number = swatchConfig.get('staticRatio') ?? 2;
        const swatchHeightConfig: number = swatchConfig.get('height') ?? 1;
        const swatchBorderRadiusConfig: number = swatchConfig.get('borderRadius') ?? 0;
        const swatchPaddingConfig: number = swatchConfig.get('labelPadding') ?? 10;
        
        const swatchShapeStyles: { [key: string]: string } = {
            'static': `width: ${swatchStaticRatioConfig * swatchHeightConfig}in;`,
            'fit': "width: fit-content;",
            'stretch': "min-width: 1in; width: 100%;",
        };
        const swatchShapeStyle: string = swatchShapeStyles[swatchShapeConfig];
        const swatchJustification: string = swatchShapeConfig === 'stretch' ? 'stretch' : 'flex-start';

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
            display: flex;
            align-items: stretch;
            justify-content: ${swatchJustification};
            ${swatchShapeConfig === 'stretch' ? 'flex-grow: 1;' : ''}
        }
        .palette-item {
            background-color: var(--palette-item-color);
            padding: ${swatchPaddingConfig}px;
            ${swatchShapeStyle}
            height: ${swatchHeightConfig}in;
            overflow: hidden;
            text-overflow: ellipsis;
            box-sizing: content;
            text-align: ${labelPositionConfig};
            font-size: var(--vscode-font-size);
            ${swatchBorderRadiusConfig > 0 ? `border-radius: ${swatchBorderRadiusConfig}px;` : ''}
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
        /* Todo */
        .add-button {
            --palette-item-color: transparent;
            color: var(--vscode-editor-foreground);
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
        ${this.hasAddButton ? addButton : ''}
    </div>
    <script>
        console.log('Hello world');
        const vscode = acquireVsCodeApi();

        let activeCategoryFilter = undefined;

        const setColorFilter = (el) => {
            if (activeCategoryFilter) {
                activeCategoryFilter.classList.remove('in-use');
            }
            activeCategoryFilter = el;
            el.classList.add('in-use');
            const filterCategory = el.title.substring('Show '.length);
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
        };

        document.querySelectorAll('.category-bubble').forEach((el) => {
            el.addEventListener('click', () => {
                setColorFilter(el);
                console.log('Bound',el);
            });
        });
        const allFilter = document.querySelector('.category-bubble[title="Show all"]');
        setColorFilter(allFilter);

        document.querySelectorAll('.palette-item-container').forEach((el) => {
            el.addEventListener('click', (event) => {
                const [_, itemValue] = el.title.split(' | ');
                if (event.target.tagName !== 'B')
                    vscode.postMessage({ command: 'get-data', body: itemValue });
            });
        });
        document.querySelectorAll('.palette-item-container b').forEach((el) => {
            el.addEventListener('click', () => {
                const itemName = el.title;
                vscode.postMessage({ command: 'get-data', body: itemName });
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
