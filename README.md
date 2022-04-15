# 1. dcc-websocket-web README

Execute code from Visual Studio Code Browser application <https://vscode.dev> inside your DCC favorite package.

- [1. dcc-websocket-web README](#1-dcc-websocket-web-readme)
  - [1.1. Disclaimer](#11-disclaimer)
  - [1.2. Description](#12-description)
  - [1.3. Requirements](#13-requirements)
  - [1.4. Usage](#14-usage)
  - [1.5. Make your WebSocket client](#15-make-your-websocket-client)
  - [1.6. Available Extension Commands](#16-available-extension-commands)
  - [1.7. Extension Settings](#17-extension-settings)
  - [1.8. Known issues](#18-known-issues)

![VscodeWeb](https://raw.githubusercontent.com/sisoe24/dcc-websocket/main/images/vscode-web.gif)

## 1.1. Disclaimer

- Currently, I have made a WebSocket server only Nuke and planning to make one for Maya and Houdini. Feel free to request if you think you might find it useful for your software.
- The extension is in a very early development stage, where I am mostly experimenting with things in vscode.dev.

## 1.2. Description

A WebSocket client for data transfer from the localhost to Visual Studio Code Web application. This extension comes in handy when coding on the fly on machines where you cannot install external applications but need a decent text editor.

## 1.3. Requirements

A running WebSocket server is necessary for the connection.

If you are a Nuke user, you can use [NukeServerSocket](https://github.com/sisoe24/NukeServerSocket/releases) `>= 0.5.0` by switching the connection mode in the settings to WebSocket.

## 1.4. Usage

Once the server is up and running, you should specify the server port in the extension settings. Then you can send the code via the [command](#16-available-extension-commands) from the command palette: `DCC: Send Code`.

## 1.5. Make your WebSocket client

The extension sends and wraps the message data a stringified associative array with two keys:

- `text`: with the contents of the currently active file
- `file`: with the path of the currently active file.

Here is an example if your server is in Python (most likely)

```py
import json
import asyncio
import websockets

async def server(websocket):
    data = await websocket.recv()

    data = json.loads(data)

    code = data.get('text')
    file = data.get('file')

    # Send the message back to the extension to be shown 
    # in the output window
    await websocket.send(code)

# host should always be localhost and
# port should match server<->client
start_server = websockets.serve(server, 'localhost', 54321)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
```

You can also go the PyQt/PySide2 route.

If you need more information, feel free to leave a message.

## 1.6. Available Extension Commands

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing in one of the following Command Name:

| Command Name     | Command ID               | Description         |
| ---------------- | ------------------------ | ------------------- |
| `DCC: Send code` | `dcc-websocket.sendCode` | Send code to socket |

By default, the extension does not provide any shortcut. But you can assign each command to one. (see [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings) for more information)

Example `keybindings.json`:

```json
[
    {
        "key":"alt+shift+r",
        "command":"dcc-websocket.sendCode",
        "when": "editorTextFocus"
    }
]
```

## 1.7. Extension Settings

- `dccWebSocket.network.port`

  Specify the server port for the connection.

- `dccWebSocket.other.clearPreviousOutput`

  Clear the previous console output text.

- `dccWebSocket.network.debug`

  Show network debug information in the output window. Enabling this option will prevent the console from being cleared after code execution.

## 1.8. Known issues

- Currently, the extension can only connect to local host (same computer).
