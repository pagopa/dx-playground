import { app, HttpRequest, InvocationContext } from "@azure/functions";
import * as df from "durable-functions";
import { OrchestrationContext } from "durable-functions";

const activityName = "TestDurableFunctionActivity";
const orchestratorName = "TestDurableFunctionOrchestrator";

df.app.activity(activityName, { handler: (input) => `Hello, ${input}` });

df.app.orchestration(
  orchestratorName,
  function* (context: OrchestrationContext) {
    const outputs: string[] = [];
    outputs.push(yield context.df.callActivity(activityName, "Tokyo"));
    outputs.push(yield context.df.callActivity(activityName, "Seattle"));
    outputs.push(yield context.df.callActivity(activityName, "Cairo"));
    return outputs;
  }
);

app.http("HealthCheckHttp", {
  route: "info",
  handler: async () => ({
    status: 200,
    body: {
      status: "OK",
    },
  }),
});

app.http("TestDurableFunctionHttp", {
  route: "test-durable-function",
  extraInputs: [df.input.durableClient()],
  handler: async (request, context) => {
    const client = df.getClient(context);
    const body: unknown = await request.text();
    const instanceId: string = await client.startNew(orchestratorName, {
      input: body,
    });
    context.log(`Started orchestration with ID = '${instanceId}'.`);
    return client.createCheckStatusResponse(request, instanceId);
  },
});
