import * as vscode from 'vscode';
import * as utils from './utils';
import { noBlanks, unique } from './utils';
import expand from 'emmet';

/**
 * Displays a small preview of a generic HTML element with the selected CSS applied.
 * 
 * The HTML used is generated from the selectors, and text content is produced from lorem ipsum.
 * Both of these can be configured through options given in annotating comments.
 * 
 * squirrel icon
 * @type {utils.EditorCommand}
 * @alias cssPreview
 */
function _cssPreview(editor: vscode.TextEditor, document: vscode.TextDocument): void {
    const viewType: string = "html";
    const title: string = "Henrian CSS Preview";
    const showOptions: vscode.ViewColumn = vscode.ViewColumn.Beside;

    const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(viewType, title, showOptions);

    const selection: vscode.Selection = editor.selection;
    const selectedCss: string = document.getText(selection);
    const css: string = document.getText();
    const html: string = constructHTMLFromCSSSelectors(selectedCss);
    panel.webview.html = getWebviewContent(css, html);
    console.log(panel.webview.html);

    return;
}

/** @inheritdoc */
export const cssPreview: utils.EditorCommand = _cssPreview;

function getWebviewContent(css: string, html: string): string {
    return `<!DOCTYPE html>
<html lang = "en">
<head>
    <style>
        ${css}
    </style>
    <style>
        body#henryrefactors-truebody {
            background-color: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            box-sizing: border-box;
        }
        details.henryrefactors-outline {
            border-left: 1px solid var(--vscode-widget-border);
            margin-top: 2rem;
            margin-bottom: 1rem;
            margin-left: -1px;
            padding-left: 3ch;
            box-sizing: border-box;
        }
        details.henryrefactors-outline > summary {
            display: flex;
            flex-flow: row wrap;
            gap: 4ch;
            align-items: baseline;
            justify-content: flex-start;
            cursor: pointer;
            box-sizing: border-box;
        }
        details.henryrefactors-outline > summary > h2 {
            display: inline-block;
            box-sizing: border-box;
            margin: 0;
        }
        details.henryrefactors-outline > summary > i {
            color: gray;
            box-sizing: border-box;
        }
        details.henryrefactors-outline > p {
            font-family: monospace;
            margin-top: 0;
            margin-bottom: 1rem;
            box-sizing: border-box;
            color: dodgerblue;
        }
        div.henryrefactors-frame-container {
            background-color: white;
            color: black;
            border: 1px solid var(--vscode-widget-border);
            padding: 10px;
            width: 100%;
            height: max-content;
            box-sizing: border-box;
            box-shadow: 0 0 20px 3px var(--vscode-widget-shadow), 0 5px 10px 2px var(--vscode-widget-shadow);
        }
        div.henryrefactors-frame-container > div.henryrefactors-frame {
            all: initial;
            box-sizing: border-box;
        }
    </style>
</head>
<body id="henryrefactors-truebody">
    ${html}
</body>
</html>`;
}

const getSelectors = (css: string): string[] => {
    // console.log("Searching for selectors in:", css);
    const selectors: string[] = css
        .replace(/[\n\r]/g, ' ')
        .replace(/\/\*.*?\*\//g, '') // Remove comments
        .split(/{.*?}/g)
        .map((str: string) => str.trim().replace(/  +/g, ' '))
        .filter(noBlanks);
    // console.log('selectors', selectors);
    return [...new Set(selectors)];
};

const processSelectors = (selectorsRaw: string[]): string[] => {
    const selectors: string[] = selectorsRaw
        .join(';').replace(/,;/g, ',').split(';')
        .flatMap((e: string) => e.split(/,\s*/g))
        .map((sel: string) => sel
            .replace(/\s([+>~])\s/g, '$1')
            .replace(/\s/g, '>span>')
            + '>lorem10'
        );
    // console.log('selectors', selectors);
    return selectors;
};

/**
 * Generates an HTML body from raw CSS.
 * @param css The CSS code to use as a blueprint for our HMTL.
 * @returns An HTML string.
 */
function constructHTMLFromCSSSelectors(css: string): string {
    const selectorsRaw: string[] = getSelectors(css);
    // console.log('selectorsRaw', selectorsRaw);
    const selectors: string[] = processSelectors(selectorsRaw);
    // console.log('selectors', selectors);
    const elements: string[] = selectors.map((selector: string): string => expand(selector));
    // console.log('elements', elements);

    console.log('selectorsRaw has', selectorsRaw.length);
    console.log('selectors has', selectors.length);
    console.log('elements has', elements.length);

    let result: string = '';
    let i: number = 0;
    let j: number = 0;
    for (; (i < selectorsRaw.length) && ((j < elements.length) && (j < selectors.length)); ++i) {
        const parts: string[] = selectorsRaw[i].split(',');
        console.log(`${selectorsRaw[i]} has`, parts.length);
        for (let j_ = 0; j_ < parts.length; ++j_, ++j) {
            // Todo: Make the colors of the header and stuff match the theme colors
            result += `
<details class="henryrefactors-outline">
    <summary>
        <h2>${parts[j_]}</h2>
        <i>${selectors[j]}</i>
    </summary>
    <p>${elements[j].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
</details>
<div class="henryrefactors-frame-container">
    <div class="henryrefactors-frame">
        ${elements[j]}
    </div>
</div>`;
        }
    }

    return result;
}

/**
 * Finds annotating comments using "@example" in the provided CSS and uses them to produce HTML examples.
 * @param css The CSS code to search for annotation comments to use as a blueprint for our HMTL.
 * @returns An HTML string.
 * @todo
 */
function constructHTMLFromAnnotation(css: string): string {

    // TODO

    return `<div>Test successful!</div>`;
}
