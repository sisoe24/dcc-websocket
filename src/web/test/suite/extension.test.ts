import * as assert from "assert";
import * as vscode from "vscode";
import { prepareMessage } from "../../socket";

// Minimal editor stub: prepareMessage only reads the document and the selection.
function fakeEditor(fileText: string, selectedText: string): vscode.TextEditor {
    return {
        selection: {},
        document: {
            fileName: "/tmp/script.py",
            getText: (range?: unknown) => (range ? selectedText : fileText),
        },
    } as unknown as vscode.TextEditor;
}

suite("prepareMessage", () => {
    test("sends only the selection when text is selected", () => {
        const msg = JSON.parse(prepareMessage(fakeEditor("print(1)\nprint(2)", "print(2)")));
        assert.deepStrictEqual(msg, { file: "/tmp/script.py", text: "print(2)" });
    });

    test("sends the whole file when nothing is selected", () => {
        const msg = JSON.parse(prepareMessage(fakeEditor("print(1)\nprint(2)", "")));
        assert.deepStrictEqual(msg, { file: "/tmp/script.py", text: "print(1)\nprint(2)" });
    });
});
