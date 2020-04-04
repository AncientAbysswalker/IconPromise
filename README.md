# IconPromise

A nodejs package that returns base64 image data for a path's icon.

This is a simple nodejs wrapper around a .net executable that will extract icon image data from a given path and return it as a promise.

Get an instance of the icon extractor in promise form with

`var iconPromise = require('icon-promise');`

To get an icon's data you need to call one of the following methods:

* `iconPromise.getIcon(filePath, sizeArg, context)`
* `iconPromise.getIcon16(filePath, context)`
* `iconPromise.getIcon32(filePath, context)`
* `iconPromise.getIcon48(filePath, context)`
* `iconPromise.getIcon256(filePath, context)`

### Method Descriptions

#### `iconPromise.getIcon(filePath, sizeArg, context)`

Extracts image data from a file's icon and provides it wrapped in a promise.
Default size is 32x32 pixels.

###### Arguments:
* `filePath`: the path of the file you want the icon for.
* `sizeArg` (optional): is the desired size of the icon. The following are acceptable:
  * `--size-16` - 16x16 icon image
  * `--size-32` - 32x32 icon image
  * `--size-48` - 48x48 icon image
  * `--size-256` - 256x256 icon image
* `context` (optional): will provide a context that will later be returned with
the promise to provide some information about what the return data is for.

###### Returns:
This will return a promise that will provide a json object containing three
fields: `Context`, `Path` and `Base64ImageData`. An example of this is provided below:

```
{
  Context [string]: "I provided context",
  Path [string]: 'C:\\Users\\TestUser\\Executable.exe',
  Base64ImageData [base64]: iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAARSURBVBhXYwCC////gzEDAwAp5AX7bk/yfwAAAABJRU5ErkJggg==
}
```

#### `iconPromise.getIcon16(filePath, context)`

Extracts image data from a file's icon and provides it wrapped in a promise.
This method extends iconPromise.getIcon() and requests size at 16x16 pixels.
The other arguments and return remain the same as iconPromise.getIcon().

#### `iconPromise.getIcon32(filePath, context)`

Extracts image data from a file's icon and provides it wrapped in a promise.
This method extends iconPromise.getIcon() and requests size at 32x32 pixels.
The other arguments and return remain the same as iconPromise.getIcon(). this
is functionally the same as iconPromise.getIcon() with the sizeArg omitted.

#### `iconPromise.getIcon48(filePath, context)`

Extracts image data from a file's icon and provides it wrapped in a promise.
This method extends iconPromise.getIcon() and requests size at 48x48 pixels.
The other arguments and return remain the same as iconPromise.getIcon().

#### `iconPromise.getIcon256(filePath, context)`

Extracts image data from a file's icon and provides it wrapped in a promise.
This method extends iconPromise.getIcon() and requests size at 256x256 pixels.
The other arguments and return remain the same as iconPromise.getIcon().
