import * as vscode from 'vscode';
import * as utils from './utils';

/**
 * Displays a small preview of a generic HTML element with the selected CSS applied.
 * 
 * The HTML used is generated from the selectors, and text content is produced from lorem ipsum.
 * Both of these can be configured through options given in annotating comments.
 * @type {utils.EditorCommand}
 * @alias cmdCssPreview
 */
function cssPreview(editor: vscode.TextEditor, document: vscode.TextDocument): void {
    const selection: vscode.Selection = editor.selection;
    const css: string = document.getText(selection);
    const html: string = constructHTMLFromCSSSelectors(css);

    const viewType: string = "html";
    const title: string = "CSS Preview";
    const showOptions: vscode.ViewColumn = vscode.ViewColumn.Beside;

    const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(viewType, title, showOptions);
    panel.webview.html = getWebviewContent(css, html);

    // ! How do we make sure the webview is safely disposed? Is that our job?

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

/**
 * Generates an HTML body from raw CSS.
 * @param css The CSS code to use as a blueprint for our HMTL.
 * @returns 
 */
function constructHTMLFromCSSSelectors(css: string): string {
    console.log("Searching for selectors in:", css);
    const brokenUp: string[] = css.split(/[{.*}]/gm).map((str: string) => str.replace(/[\n\r]/g, ' ').replace(/\s{2,}/g, ' ').trim()).filter((str: string) => str.length !== 0);
    console.log(brokenUp);
    const selectors: string[] = brokenUp;

    if (selectors === null) {
        console.log("No selectors found");
        return '<p>No selectors could be identified :(</p>';
    }

    return `<div></div>`;
}
