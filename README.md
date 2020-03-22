# IconPromise

A nodejs package that returns base64 image data for a path's icon.

This is a simple nodejs wrapper around a .net executable that will extract icon image data from a given path and return it as a promise.

Get an instance of the icon extractor in promise form with

`var iconPromise = require('icon-promise');`

To get an icon's data you need to call the `iconPromise.getIcon(context, filePath)` function which takes two parameters.
The first is a context parameter; this will return with the icon data so you can have some information about what the return
data is for. The second parameter is the path of the file you want the icon for.

The promise will return a json object containing three fields, `Context`, `Path` and `Base64ImageData`, of the form:

```
{
  Context: 'myContext',
  Path: 'myPath',
  Base64ImageData: 'rawDataReturn'
}
```
