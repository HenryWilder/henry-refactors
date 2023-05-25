import * as vscode from 'vscode';
import * as utils from './utils';

/**
 * A tool which allows users to quickly test small features of a language without creating a separate project.
 *
 * **Currently only works with JavaScript.**
 *
 * (I'm not sure how to implement a compiler for other languages in there at the moment, but it would be super nice)
 *
 * @todo Add a small library for easily timing code performance.
 */
export class LanguageCheckProvider implements vscode.WebviewViewProvider {
    constructor() { }

    resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        token: vscode.CancellationToken
    ): Thenable<void> | void {
        webviewView.title = "Language Check";
        webviewView.webview.options = { enableScripts: true };

        webviewView.webview.html = `<!DOCTYPE html>
<html>
<head>
    <style>
    </style>
</head>
<body>
    <textarea id="henryrefactors-languagecheck-isolated-code-execution-field" placeholder="Start typing some code to test"></textarea>
    <button id="henryrefactors-languagecheck-isolated-code-execution-button">Run</button>
    <script>
        const vscode = acquireVsCodeApi();
        const field = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-field');
        const executeButton = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-button');
        executeButton.addEventListener('click', () => {
            vscode.postMessage({ command: 'run-prototype', body: field.innerText });
        });
    </script>
</body>
</html>`;

        // Handle click events
        webviewView.webview.onDidReceiveMessage(
            (msg) => {
                switch (msg.command) {
                    case 'run-prototype':
                        console.log('Executing the code:', msg.body);
                        utils.hwCmd(() => { Function(msg.body)(); });
                        break;
                }
            }
        );
    }
}

