# **@sugo/cors**

Middleware for parsing Json type requests

## **How to install**

```shell
npm install --save @sugo/body-parser-json
```

## **getSuGoJsonBodyParserMiddleware**

Builds the middleware.

## **Example - Node Http Server**

```typescript
import getParseJsonBody, { IRequest } from '@sugo/body-parser-json';
const parseJsonBody = getParseJsonBody();
const server = http.createServer(async (req: IRequest, res: http.ServerResponse) => {
  await parseJsonBody(req, res);
  res.writeHead(200, headers);
  res.end(JSON.stringify(req.body));
});
```

## **Example - SuGo Server**

```typescript
import { createServer, SuGoRequest, SuGoResponse } from '@sugo/server';
import getParseJsonBody, { IRequest } from '@sugo/body-parser-json';
const parseJsonBody = getParseJsonBody();
const server = createServer((req: SuGoRequest, res: SuGoResponse) => {
  res.writeHead(200, headers);
  res.end(JSON.stringify(req.body ? req.body : {}));
}).useMiddleware(parseJsonBody);
```
