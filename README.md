
# DynamoDB Provider

This is a DynamoDB provider for underflag (feature flag/feature toggle)

> ⚠️ This repository has been **archived** for visual organization on GitHub.  
> It is part of the [`underflag`](https://github.com/diemsouza/underflag) monorepo, where it's maintained and updated.  
> The package is still available on [NPM](https://www.npmjs.com/package/underflag-dynamodb).

## Install

Using npm:

```bash
npm install underflag-dynamodb
```

Using yarn:

```bash
yarn add underflag-dynamodb
```

## How to use

Import the underflag and prepare to load data provider

```js
import { Underflag } from "underflag";
import { DynamodbDataProvider } from "underflag-dynamodb";
const client = { region: "us-east-1" };
const dataProvider = new DynamodbDataProvider({ client });
const underflag = new Underflag({ dataProvider });
if (await underflag.isOn("feature")) {
    // ...
}
```

_Attention: Do not forget of create the features table in AWS DynamoDB with the key and value columns._

Know more on [underflag npm page](https://www.npmjs.com/package/underflag)

### License

[MIT](LICENSE)
