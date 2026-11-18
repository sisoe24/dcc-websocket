import * as vscode from "vscode";
import * as utils from "./utils";

export const outputWindow = vscode.window.createOutputChannel("DCC WebSocket");

/**
 * Write received data from the socket to the output window.
 *
 * @param data text data to write into the output window.
 * @param filePath path to the file that is being executed.
 */
export function writeToOutputWindow(data: string, filePath: string): string {
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
 * @param data text data to write into the output window.
 */
function writeDebugNetwork(data: string): string {
    let msg = "";

    if (utils.extensionConfig("network.debug")) {
        const timestamp = new Date();
        msg = `[${timestamp.toISOString()}] - ${data}`;
        outputWindow.appendLine(msg);
    }
    return msg;
}

// Last open socket. Closed on the next send so connections do not pile up,
// while a server can still stream several replies for one send.
let socket: WebSocket | undefined;

/**
 * Send data over websocket connection.
 */
export function sendMessage() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    socket?.close();

    const hostname = "localhost";
    const port = utils.extensionConfig("network.port");
    const showDebug = Boolean(utils.extensionConfig("network.debug"));

    // Debug mode keeps previous output so the network log stays readable.
    if (utils.extensionConfig("other.clearPreviousOutput") && !showDebug) {
        outputWindow.clear();
    }

    writeDebugNetwork(`Establish Connection to: ${hostname}:${port}`);
    const ws = new WebSocket(`ws://${hostname}:${port}`);
    socket = ws;

    ws.onopen = function () {
        writeDebugNetwork(`Connection established! Send to server...`);
        ws.send(prepareMessage(editor));
    };

    ws.onmessage = function (event) {
        writeToOutputWindow(event.data, editor.document.fileName);
        writeDebugNetwork(`[message] Data received from server: ${event.data}`);
    };

    ws.onclose = function (event) {
        if (event.wasClean) {
            writeDebugNetwork(
                `Connection closed cleanly, code=${event.code} reason=${event.reason}`
            );
        } else {
            writeDebugNetwork("Connection died");
        }
    };

    ws.onerror = function () {
        // Closing a still-connecting socket from a previous send fires an error too.
        if (socket !== ws) {
            return;
        }
        vscode.window.showErrorMessage(
            "An error occurred. Check if connection server is running and/or port matches the one from the server."
        );
    };
}
