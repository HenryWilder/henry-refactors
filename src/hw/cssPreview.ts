import * as vscode from 'vscode';
import * as utils from './utils';
import { noBlanks } from './utils';
import expand from 'emmet';

/**
 * Displays a small preview of a generic HTML element with the selected CSS applied.
 * 
 * The HTML used is generated from the selectors, and text content is produced from lorem ipsum.
 * Both of these can be configured through options given in annotating comments.
 * @type {utils.EditorCommand}
 * @alias cmdCssPreview
 */
function cssPreview(editor: vscode.TextEditor, document: vscode.TextDocument): void {
    const viewType: string = "html";
    const title: string = "CSS Preview";
    const showOptions: vscode.ViewColumn = vscode.ViewColumn.Beside;

    const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(viewType, title, showOptions);
    // ! How do we make sure the webview is safely disposed? Is that our job?

    const selection: vscode.Selection = editor.selection;
    const css: string = document.getText(selection);
    const html: string = constructHTMLFromCSSSelectors(css);
    panel.webview.html = getWebviewContent(css, html);

    return;
}

/** @inheritdoc */
export const cmdCssPreview: utils.EditorCommand = cssPreview;

function getWebviewContent(css: string, html: string): string {
    return `<!DOCTYPE html>
<html lang = "en">
<head>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
}

function getSelectors(css: string): string[] {
    console.log("Searching for selectors in:", css);
    const selectors: string[] = css
        .replace(/[\n\r]/g, ' ')
        .split(/{.*?}/g)
        .map((str: string) => str.trim().replace(/  +/g, ' '))
        .filter(noBlanks)
        .join(';').replace(/,;/g, ',').split(';')
        .map((sel: string) => sel
            .replace(/, /g, ',')
            .replace(/\s([+>~])\s/g, '$1'));
    console.log('selectors', selectors);
    return selectors;
}

/**
 * Generates an HTML body from raw CSS.
 * @param css The CSS code to use as a blueprint for our HMTL.
 * @returns An HTML string.
 */
function constructHTMLFromCSSSelectors(css: string): string {
    const selectors: string[] = getSelectors(css);
    console.log('selectors', selectors);
    const elements: string[] = selectors.map((selector: string): string => expand(selector));
    console.log('elements', elements);

    return elements.join('\n');
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
