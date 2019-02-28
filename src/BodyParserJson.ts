import { IncomingMessage, ServerResponse } from 'http';

export interface IRequest extends IncomingMessage {
  body?: any;
}

export const getSuGoJsonBodyParserMiddleware = (options?: any) => new SuGoJsonBodyParser().asMiddleware();

export class SuGoJsonBodyParser {
  public asMiddleware() {
    return async (req: IRequest, res: ServerResponse, next?: () => any) => {
      const contentType = req.headers['content-type'] as string;
      const isJson: boolean = contentType.toLowerCase().includes('application/json');
      if (!isJson) {
        return next ? await next() : null;
      }
      await new Promise(resolve => {
        let rawBody: Buffer = Buffer.from('', 'utf8');
        req
          .on('data', data => {
            const auxBuffer = Buffer.from(data, 'utf8');
            rawBody = Buffer.concat([rawBody, auxBuffer]);
          })
          .on('end', () => {
            req.body = rawBody.length > 0 ? JSON.parse(rawBody.toString()) : {};
            resolve(req.body);
          });
      });
      return next ? await next() : null;
    };
  }
}

export default getSuGoJsonBodyParserMiddleware;
