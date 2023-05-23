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
    return;
}

/** @inheritdoc */
export const cmdCssPreview: utils.EditorCommand = cssPreview;
