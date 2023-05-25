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
        #languagecheck-container {
            display: flex;
            flex-flow: column nowrap;
            align-items: flex-start;
            justify-content: flex-start;
            gap: 5px;
        }
        #languagecheck-container > button {
            display: flex;
            align-items: center;
            justify-content: center;
            box-sizing: border-box;
            line-height: 18px;
            font-family: var(--vscode-button-font-family);
            font-weight: var(--vscode-button-font-weight);
            font-size: var(--vscode-button-font-size);
            color: var(--vscode-button-foreground);
            background-color: var(--vscode-button-background);
            text-align: center;
            border: 1px solid transparent;
            border-radius: 2px;
            padding: 4px;
            margin-inline: auto;
            width: 100%;
            max-width: 300px;
            cursor: pointer;
        }
        #languagecheck-container > button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        #languagecheck-container > textarea {
            font-family: var(--vscode-editor-font-family), monospace;
            font-weight: var(--vscode-editor-font-weight);
            font-size: var(--vscode-editor-font-size);
            color: var(--vscode-editor-foreground);
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-input-border, transparent);
            width: 100%;
            resize: vertical;
            padding: 3px;
            box-sizing: border-box;
            border-radius: 2px;
        }
        #languagecheck-container > textarea:focus {
            outline: none;
            border-color: var(--vscode-focusBorder, transparent);
        }
    </style>
</head>
<body>
    <div id="languagecheck-container">
        <button id="henryrefactors-languagecheck-isolated-code-execution-button" role="button">
            <span>Run</span>
        </button>
        <!-- <textarea id="henryrefactors-languagecheck-isolated-code-execution-input" placeholder="Put any inputs to your program here"></textarea> -->
        <textarea id="henryrefactors-languagecheck-isolated-code-execution-code" placeholder="Start typing some code to test"></textarea>
        <b>Output</b>
        <div id="henryrefactors-languagecheck-isolated-code-execution-output"></div>
    </div>
    <script>
        try {
            const vscode = acquireVsCodeApi();
            console.log(vscode);
            const executeButton = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-button');
            const codeField = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-code');
            const outputField = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-output');
            executeButton.addEventListener('click', () => {
                vscode.postMessage({
                    command: 'run-prototype',
                    body: codeField.value,
                });
            });
            window.addEventListener('message', (event) => {
                const msg = event.data;
                switch (msg.command) {
                    case 'push-output':
                        outputField.innerText += msg.body;
                        break;
                }
            });
        } catch(err) {
            console.error(err);
        }
    </script>
</body>
</html>`;

        // Handle click events
        webviewView.webview.onDidReceiveMessage(
            (msg: { command: string, body: string }) => {
                switch (msg.command) {
                    case 'run-prototype':
                        vscode.window.showInformationMessage('Executing your code...');
                        runUserInput(msg.body, webviewView.webview);
                        break;
                }
            }
        );
    }
}

const runUserInput = (userCode: string, webview: vscode.Webview) => {
    try {
        // I will greatly appriciate any advice/suggestions on anything else that needs to be escaped to ensure safety & stability.
        Function(`((webview) => {
            const henryRefactorsLog = (message, ...optionalParams) => {
                webview.postMessage({
                    command: 'push-output',
                    body: [message, ...(optionalParams.map((e: any) => e.toString()))].join(' '),
                });
            };
            ${userCode.replace(/console\.log/g, 'henryRefactorsLog').replace(/\b(?:webview|acquireVsCodeApi|token|TOKEN|eval)\b/g, '')}
        })`)(webview);
    } catch (err) {
        console.error(err);

        if (typeof err === 'string') {
            vscode.window.showErrorMessage(err);
        } else if (err instanceof Error) {
            vscode.window.showErrorMessage(`${err.name}: ${err.message} ${err?.stack}`);
        } else {
            vscode.window.showErrorMessage(`Unexpected error type '${typeof err}' - ${err}`);
        }
    }
};
