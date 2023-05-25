/**
 * @file
 * A tool which allows users to quickly test small features of a language without creating a separate project.
 * **Currently only works with JavaScript.**
 * (I'm not sure how to implement a compiler for other languages in there at the moment, but it would be super nice)
 *
 * @todo Add a small library for easily timing code performance.
 * @todo Actually implement the code.
 */

import * as vscode from 'vscode';
import * as utils from './utils';

/**
 * **Placeholder code copied from palette**
 */

// export class PaletteProvider implements vscode.WebviewViewProvider {
//     constructor(
//         private title: string,
//         private colorList: NamedColor[],
//     ) { }

//     resolveWebviewView(
//         webviewView: vscode.WebviewView,
//         context: vscode.WebviewViewResolveContext,
//         token: vscode.CancellationToken
//     ): Thenable<void> | void {
//         webviewView.title = this.title;
//         webviewView.webview.options = { enableScripts: true };

//         const list = this.colorList.map((e: NamedColor) => {
//             return `
// <div class="palette-item-container" title="${e.name} | ${e.value}">
//     <div class="palette-item" style="--palette-item-color:${e.value}; color:${hwColor.colorContrast(hwColor.ColorConvert.hex6.toRGB01(e.value))}">
//         <b>${e.name}</b><br/>
//         <c>${e.value}</c>
//     </div>
// </div>`;
//         });

//         webviewView.webview.html = `<!DOCTYPE html>
// <html>
// <head>
//     <style>
//         #palette {
//             display: flex;
//             flex-flow: row wrap;
//             align-items: stretch;
//             gap: 0px;
//             padding-block: 10px;
//         }
//         .palette-item-container {
//             padding: 5px;
//             cursor: pointer;
//             box-sizing: border-box;
//         }
//         .palette-item {
//             background-color: var(--palette-item-color);
//             padding: 10px;
//             width: 2in;
//             height: 1in;
//             overflow: hidden;
//             text-overflow: ellipsis;
//             box-sizing: content;
//             text-align: right;
//             font-size: var(--vscode-font-size);
//         }
//         .palette-item-container:hover .palette-item {
//             outline: 2px dashed var(--vscode-editor-foreground);
//         }
//         .palette-item-container:active .palette-item {
//             outline-style: solid;
//         }
//         .palette-item>b:hover {
//             text-decoration: underline;
//         }
//         c {
//             font-size: var(--vscode-editor-font-size);
//             font-family: var(--vscode-editor-font-family);
//             font-weight: var(--vscode-editor-font-weight);
//         }
//     </style>
// </head>
// <body>
//     <div id="palette">
//         ${list.join('\n')}
//     </div>
//     <script>
//         console.log('Hello world');
//         const vscode = acquireVsCodeApi();
//         document.querySelectorAll('.palette-item-container').forEach((el) => {
//             el.addEventListener('click', (event) => {
//                 let messageBody = '';
//                 const [itemName, itemValue] = el.title.split(' | ');
//                 if (event.target.tagName === 'B')
//                     messageBody = itemName;
//                 else
//                     messageBody = itemValue;
//                 vscode.postMessage({ command: 'get-data', body: messageBody });
//             });
//         });
//     </script>
// </body>
// </html>`;

//         // Handle click events
//         webviewView.webview.onDidReceiveMessage(
//             (msg) => {
//                 switch (msg.command) {
//                     case 'get-data':
//                         console.log(`%c${msg.body}%c is ${hwColor.colorCategory(hwColor.ColorConvert.hex6.toHSL(msg.body))}`, `color:${msg.body}`, "color:unset");
//                         vscode.env.clipboard.writeText(msg.body);
//                         vscode.window.showInformationMessage(`"${msg.body}" has been copied`);
//                         break;
//                 }
//             }
//         );
//     }
// }

