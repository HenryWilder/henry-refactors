const style: string = `
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
    padding: 4px;
    box-sizing: border-box;
    border-radius: 2px;
    min-height: 3rem;
    height: 15.5rem;
}
#languagecheck-container > textarea:focus {
    outline: none;
    border-color: var(--vscode-focusBorder, transparent);
}
#henryrefactors-languagecheck-isolated-code-execution-output {
    width: 100%;
    box-sizing: border-box;
}
.henryrefactors-msg-info,
.henryrefactors-msg-warn,
.henryrefactors-msg-err {
    font-family: var(--vscode-repl-font-family);
    font-size: var(--vscode-repl-font-size);
    line-height: var(--vscode-repl-line-height);
    word-wrap: break-word;
    white-space: pre-wrap;
    word-break: break-all;
    -webkit-user-select: text;
    cursor: text;
    display: block;
    width: 100%;
    box-sizing: border-box;
    background-color: transparent;
    padding: 0.125rem 0.5ch;
}
.henryrefactors-msg-info:hover,
.henryrefactors-msg-warn:hover,
.henryrefactors-msg-err:hover {
    background-color: var(--vscode-list-hoverBackground);
}
.henryrefactors-msg-info { color: #3794ff; }
.henryrefactors-msg-warn { color: #E9AB17; }
.henryrefactors-msg-err  { color: #F85149; }
.section-label {
    -webkit-user-select: none;
    text-transform: uppercase;
    display: flex;
    font-size: 11px;
    font-weight: normal;
}
.group {
    /* todo */
}
.group-label {
    /* todo */
}
`;

const script: string = `
try {
    const vscode = acquireVsCodeApi();

    const executeButton = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-button');
    const codeField = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-code');
    const outputField = document.getElementById('henryrefactors-languagecheck-isolated-code-execution-output');

    let groupStack = [];
    const pushToGroup = (el) => {
        if (groupStack.length === 0) {
            outputField.appendChild(el);
        } else {
            groupStack[groupStack.length - 1].appendChild(el);
        }
    };

    executeButton.addEventListener('click', () => {
        vscode.postMessage({
            command: 'run-prototype',
            body: codeField.value,
        });
    });

    window.addEventListener('message', (event) => {
        const msg = event.data;
        console.log(msg);
        switch (msg.command) {

            case 'push-output': {
                    const logElement = document.createElement('div');
                    logElement.classList.add('henryrefactors-msg-' + msg.type);
                    logElement.innerText = msg.body;
                    pushToGroup(logElement);
                } break;

            case 'clear-output': {
                    outputField.innerHTML = '';
                } break;

            case 'push-group': {
                    const groupElement = document.createElement('details');
                    groupElement.classList.add('group');
                    const groupLabel = document.createElement('summary');
                    groupLabel.classList.add('group-label');
                    groupLabel.innerText = msg.body;
                    groupElement.appendChild(groupLabel);
                    pushToGroup(groupElement);
                    groupStack.push(groupElement);
                } break;

            case 'close-group': {
                    if (groupStack.length > 0) {
                        groupStack.pop();
                    }
                } break;
        }
    });
} catch(err) {
    console.error(err);
}
`;

export default `<!DOCTYPE html>
<html>
<head>
    <style>${style}</style>
</head>
<body>
    <div id="languagecheck-container">
        <textarea id="henryrefactors-languagecheck-isolated-code-execution-code" placeholder="Start typing some code to test"></textarea>
        <button id="henryrefactors-languagecheck-isolated-code-execution-button" role="button">
            <span>Run</span>
        </button>
        <h2 class="section-label">Output</h2>
        <div id="henryrefactors-languagecheck-isolated-code-execution-output"></div>
    </div>
    <script>${script}</script>
</body>
</html>` as string;
