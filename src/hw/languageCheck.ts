import * as vscode from 'vscode';
import * as utils from './utils';
import webviewHTML from './languageCheckWebview';
import { runUserCodeInIsolation } from '../little-box/isolation-chamber';

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

        webviewView.webview.html = webviewHTML;

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

    const clrMethod = (): void => { webview.postMessage({ command: 'clear-output' }); };
    clrMethod();

    const logMethod = (message: any, ...optionalParams: any[]): void => {
        const msgBody: string = [message.toString(), ...(optionalParams.map((e) => e.toString()))].join(' ');
        webview.postMessage({
            command: 'push-output',
            body: msgBody,
            type: 'info',
        });
    };

    const warnMethod = (message: any, ...optionalParams: any[]): void => {
        const msgBody: string = [message.toString(), ...(optionalParams.map((e) => e.toString()))].join(' ');
        webview.postMessage({
            command: 'push-output',
            body: msgBody,
            type: 'warn',
        });
    };

    const errMethod = (message: any, ...optionalParams: any[]): void => {
        const msgBody: string = [message.toString(), ...(optionalParams.map((e) => e.toString()))].join(' ');
        webview.postMessage({
            command: 'push-output',
            body: msgBody,
            type: 'err',
        });
    };

    const messageWebview = (msg: any): void => {
        webview.postMessage(msg);
    };

    try {

        runUserCodeInIsolation(userCode, logMethod, warnMethod, errMethod, clrMethod, messageWebview);

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
