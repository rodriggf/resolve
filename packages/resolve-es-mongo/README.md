# `resolve-es-mongo`

This package serves as a driver for `resolve-es` to store events using MongoDB.

## Usage

```js
import createDriver from 'resolve-es-mongo';

const driver = createDriver({
    url: 'mongo_url',
    collection: 'events'
});
```