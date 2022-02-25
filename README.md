# 1. dcc-websocket-web README

WebSocket connection to send messages to a localhost machine client.

- [1. dcc-websocket-web README](#1-dcc-websocket-web-readme)
  - [1.1. Disclaimer](#11-disclaimer)
  - [1.2. Description](#12-description)
  - [1.3. Requirements](#13-requirements)
  - [1.4. Usage](#14-usage)
  - [1.5. Make your own WebSocket client](#15-make-your-own-websocket-client)
  - [1.6. Available Extension Commands](#16-available-extension-commands)
  - [1.7. Extension Settings](#17-extension-settings)
    - [1.7.1. `dccWebSocket.network.port`](#171-dccwebsocketnetworkport)
    - [1.7.2. `dccWebSocket.other.clearPreviousOutput`](#172-dccwebsocketotherclearpreviousoutput)
    - [1.7.3. `dccWebSocket.network.debug`](#173-dccwebsocketnetworkdebug)
  - [1.8. Known issues](#18-known-issues)

![VscodeWeb](https://raw.githubusercontent.com/sisoe24/dcc-websocket/main/images/vscode-web.gif)

## 1.1. Disclaimer

- This extension is mainly for the Visual Studio Code Browser application: <https://vscode.dev>
- Although the name of the extension contains the word DCC, currently at the time of writing, it has no unique features for it.

## 1.2. Description

A WebSocket client that allows to send messages to the localhost from Visual Studio Code Web application. This can be used to code on the fly on machines that you are not allowed to install external applications but still need a decent text editor.

## 1.3. Requirements

A WebSocket server is required on the other end of the connection.

If you are a Nuke user, you can use [NukeServerSocket](https://github.com/sisoe24/NukeServerSocket/releases) `>= 0.5.0` by switching the connection mode in the settings to WebSocket.

> Currently I only use Nuke, but in the near future I might do it for Maya and Houdini. Feel free to make a request if you think you might find it useful for your software.

## 1.4. Usage

Once the server is up and running, you should specify the server port in the extension settings. Then you can send the code via the [command](#16-available-extension-commands) from the command palette: `DCC: Send Code`.

## 1.5. Make your own WebSocket client

From the extension point of view, the message sent is inside a stringified associative
array with the key `text` containing the contents of the current active file and the key `file` with the path of the current active file.

Here is an example if your server in written in Python (most likely)

```py
import json
import asyncio
import websockets

async def server(websocket, path):
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

If you need more information feel free to leave a message.

## 1.6. Available Extension Commands

All commands are available by opening the Command Palette (`Command+Shift+P` on macOS and `Ctrl+Shift+P` on Windows/Linux) and typing in one of the following Command Name:

| Command Name     | Command ID               | Description         |
| ---------------- | ------------------------ | ------------------- |
| `DCC: Send code` | `dcc-websocket.sendCode` | Send code to socket |

By default the extension does not provide any shortcut, but every command can be assigned to one. (see [Key Bindings for Visual Studio Code](https://code.visualstudio.com/docs/getstarted/keybindings) for more information)

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

### 1.7.1. `dccWebSocket.network.port`

Specify the server port for the connection.

### 1.7.2. `dccWebSocket.other.clearPreviousOutput`

Clear previous console output before next code execution.

### 1.7.3. `dccWebSocket.network.debug`

Show network debug information in the output window. Enabling this option, will prevent the console from being cleared after code execution.

## 1.8. Known issues

- Currently extension can only connect to localhost (same computer).
