import { app } from '@azure/functions';
import {makeInfoHandler} from "./adapters/azure/functions/info";

app.http('info', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: makeInfoHandler({}),
  route: 'info',
});
