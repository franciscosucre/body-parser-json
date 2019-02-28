import { createServer, SuGoRequest, SuGoResponse } from '@sugo/server';
import * as chai from 'chai';
import * as http from 'http';
import * as supertest from 'supertest';
import getParseJsonBody, { IRequest } from '../BodyParserJson';
const parseJsonBody = getParseJsonBody();

const PATH = '/foo';
const headers = { 'Content-Type': 'application/json' };
const HANDLER = (req: SuGoRequest, res: SuGoResponse) => {
  res.writeHead(200, headers);
  res.end(JSON.stringify(req.body ? req.body : {}));
};
chai.should();

describe('SuGo Json Body Parser', () => {
  it('should not parse anything if content-type is not json', async () => {
    const server = http.createServer(async (req: IRequest, res: http.ServerResponse) => {
      await parseJsonBody(req, res);
      chai.expect(req.body).to.be.eql(undefined);
      res.writeHead(200, headers);
      res.end(JSON.stringify(req.body ? req.body : {}));
    });
    const response = await supertest(server)
      .post(PATH)
      .set('Content-type', 'text/html')
      .send('foo');
    response.status.should.be.eql(200);
  });

  it('should be compatible with NodeJS http server', async () => {
    const server = http.createServer(async (req: IRequest, res: http.ServerResponse) => {
      await parseJsonBody(req, res);
      res.writeHead(200, headers);
      res.end(JSON.stringify(req.body));
    });
    const response = await supertest(server)
      .post(PATH)
      .set('Content-type', 'application/json')
      .send({ foo: 'fighters' });
    response.body.should.have.property('foo');
    response.body.foo.should.be.eql('fighters');
  });

  it('should be compatible with SuGO Server', async () => {
    const server = createServer(HANDLER).useMiddleware(parseJsonBody);
    const response = await supertest(server)
      .post(PATH)
      .set('Content-type', 'application/json')
      .send({ foo: 'fighters' });
    response.body.should.have.property('foo');
    response.body.foo.should.be.eql('fighters');
  });

  after(() => {
    process.exit(0);
  });
});
