import * as vscode from "vscode";
import * as utils from "./utils";

export const outputWindow = vscode.window.createOutputChannel("DCC WebSocket");

/**
 * Write received data from the socket to the output window.
 *
 * @param data text data to write into the output window.
 * @param filePath path to the file that is being executed.
 * @param showDebug if true, the output window will not be cleared despite the settings.
 */
export function writeToOutputWindow(data: string, filePath: string, showDebug: boolean): string {
    if (utils.nukeToolsConfig("other.clearPreviousOutput") && !showDebug) {
        outputWindow.clear();
    }

    const msg = `> Executing: ${filePath}\n${data}`;

    outputWindow.appendLine(msg);
    outputWindow.show(true);

    return msg.replace(/\n/g, "\\n");
}

/**
 * Prepare the message to be sent to the socket.
 *
 * If editor has no selected text, the whole file will be sent. Otherwise only
 * the selected text.
 *
 * @param editor - vscode TextEditor instance.
 * @returns a stringified object with the data to be sent. The data will contain
 * a stringified array with the key `text` and `file`.
 */
export function prepareMessage(editor: vscode.TextEditor): string {
    const document = editor.document;
    const selection = editor.selection;
    const selectedText = document.getText(selection);

    const data = {
        file: editor.document.fileName,
        text: selectedText || editor.document.getText(),
    };
    return JSON.stringify(data);
}

/**
 *  Write debug information to the output window.
 *
 * @param showDebug if true, will output debug information to the output window.
 * @param data text data to write into the output window.
 */
function writeDebugNetwork(data: string): string {
    let msg = "";

    if (utils.nukeToolsConfig("network.debug")) {
        const timestamp = new Date();
        msg = `[${timestamp.toISOString()}] - ${data}`;
        outputWindow.appendLine(msg);
    }
    return msg;
}

/**
 * Send data over websocket connection.
 */
export function sendMessage() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return null;
    }

    const hostname = "localhost";
    const port = utils.nukeToolsConfig("network.port");
    writeDebugNetwork(`Establish Connection to: ${hostname}:${port}`);
    const socket = new WebSocket(`ws://${hostname}:${port}`);

    socket.onopen = function (e) {
        writeDebugNetwork(`Connection established! Send to server...`);
        socket.send(prepareMessage(editor));
    };

    socket.onmessage = function (event) {
        writeToOutputWindow(event.data, editor.document.fileName, false);
        writeDebugNetwork(`[message] Data received from server: ${event.data}`);
    };

    socket.onclose = function (event) {
        if (event.wasClean) {
            writeDebugNetwork(
                `Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
        } else {
            writeDebugNetwork("Connection died");
        }
    };

    socket.onerror = function (error) {
        vscode.window.showErrorMessage(
            "An error occurred. Check if connection port matches the one from the server."
        );
    };
}
