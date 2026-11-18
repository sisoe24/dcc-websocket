# Change Log

## [Unreleased]

### Changed

- Require VS Code 1.74 or newer. The extension now activates on its command instead of at startup.
- Upgrade the development toolchain (TypeScript 5.9, webpack 5.112, ESLint 10, mocha 11, @vscode/test-web 0.0.81).

### Fixed

- `network.debug` now keeps previous output, as documented.
- A server can send several replies for one execution without each reply clearing the previous one.
- Close the previous connection on each new send.

### Removed

- The developer debug command and the bundled Nuke stubs.

## [0.0.5]

### Fixed

- Fixed wrong setting name that did not allow to send code.

## [0.0.1]

- Initial release.
