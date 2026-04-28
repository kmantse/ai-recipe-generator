import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { AmplifyGraphqlApi } from "@aws-amplify/graphql-api-construct"; 

const backend = defineBackend({
  auth,
  data,
});

const backendData = (backend as any).data as AmplifyGraphqlApi;

const bedrockDataSource = backendData.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    resources: [
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20241022-v2:0",
    ],
    actions: ["bedrock:InvokeModel"],
  })
);