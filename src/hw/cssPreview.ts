import * as vscode from 'vscode';
import * as utils from './utils';
import { noBlanks } from './utils';
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
    const html: string = constructHTMLFromCSSSelectors(selectedCss, css);
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
        
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
}

const getSelectors = (css: string): string[] => {
    // console.log("Searching for selectors in:", css);
    const selectors: string[] = css
        .replace(/[\n\r]/g, ' ')
        .split(/{.*?}/g)
        .map((str: string) => str.trim().replace(/  +/g, ' '))
        .filter(noBlanks);
    // console.log('selectors', selectors);
    return selectors;
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
function constructHTMLFromCSSSelectors(selectionCSS: string, css: string): string {
    const selectorsRaw: string[] = getSelectors(selectionCSS);
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
            
            const frameContent: string = `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        ${css}
    </style>
</head>
<body>
    ${elements[j]}
</body>
</html>`;
            // Todo: Make the colors of the header and stuff match the theme colors
            result += `
<div style="display:flex;flex-flow:row wrap;gap:4ch;align-items:baseline;justify-content:flex-start;cursor:default;">
    <h2 style="display:inline-block">${parts[j_]}</h2>
    <i style="color:gray;">${selectors[j]}</i>
</div>
<iframe id="frame${j}"></iframe>
<script>
    const frame${j} = document.getElementById('frame${j}');
    frame${j}.contentDocument.write(\`${frameContent}\`);
</script>`;
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
