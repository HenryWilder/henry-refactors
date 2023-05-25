# Henry Refactors

Some neat little additions I just wanted to add for my own use. You can use them too if you like.

## Features

### Henry Align

An alignment command that aligns selected text by all special characters.

![Web Palette](images/henry-align-example.png)

**Note:** Only works correctly with *multiple* selection. Lines will be concatenated if you select the full text all in one selection.

### CSS Preview

Preview selected CSS - uses Emmet to expand CSS selectors into HTML so you can preview your styles before creating the page.

![Web Palette](images/css-preview-example1.png)

Emmet expansions can also work on commented text if you highlight specifically the insides of the comment

![Web Palette](images/css-preview-example2.png)

### Web Palette

A helpful panel for seeing many named colors that copy when clicked.

![Web Palette](images/web-palette-example.png)

## Known Issues

- Henry Align adds trailing whitespace
- Henry Align doesn't necessarily align matching text sections
- Running CSS Preview while not having text selected can cause errors
- CSS Preview command must be re-executed to refresh, which creates a new webview instance every time
- CSS Preview is not very flexible and can error easily in many situations. This includes the use of `:has()`, `:hover`, `::after`, and other things that cannot actually be expanded by Emmet.

## Release Notes

*The extension is still in development and not yet fully released.*
