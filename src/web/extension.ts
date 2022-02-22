import * as vscode from "vscode";
import { sendMessage } from "./socket";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand("dcc-websocket.sendCode", () => {
            sendMessage();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {}
