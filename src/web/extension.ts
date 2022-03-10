import * as vscode from "vscode";
import { sendMessage } from "./socket";
import { addStubsPath, correctAnalysisPath } from "./stubs";

export function activate(context: vscode.ExtensionContext) {
    // correctAnalysisPath();

    context.subscriptions.push(
        vscode.commands.registerCommand("dcc-websocket.developerDebugCommand", () => {
            addStubsPath();
        })
    );
    context.subscriptions.push(
        vscode.commands.registerCommand("dcc-websocket.sendCode", () => {
            sendMessage();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
