import * as cdk from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as events from "aws-cdk-lib/aws-events"
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path"
import * as apiGateway from "aws-cdk-lib/aws-apigateway"
import {LambdaFunction} from "aws-cdk-lib/aws-events-targets";

interface lambdaParameters {
    scope: cdk.Stack,
    id: string,
    handler: string,
    entryPath: string
}

interface eventRuleParameters {
    scope: cdk.Stack,
    id: string,
    bus: events.EventBus,
    pattern: {
        source: string[]
    }
    targets: LambdaFunction[]
}

class MyStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);
        ircServerStack(this)
        ircClientStack(this)
    }
}

function ircServerStack(scope: cdk.Stack) {
    const ircServer = createLambda({
        scope,
        id: "irc-server",
        handler: "serverHandler",
        entryPath: "../src/socket-server-lambda/handler.ts"
    })

    const api = new apiGateway.LambdaRestApi(scope, "irc-server-gateway", {
        handler: ircServer,
        proxy: false
    })
    api.root.addMethod("GET")

    const joinResource = api.root.addResource("join")
    joinResource.addMethod("POST")
}

function ircClientStack(scope: cdk.Stack) {
    const ircClient = createLambda({
        scope,
        id: "irc-client",
        handler: "clientHandler",
        entryPath: "../src/socket-client-lambda/handler.ts"
    })

    const eventBus = new events.EventBus(scope, "irc-eventbus")
    createEventRule({
        scope,
        id: "emit-message-rule",
        bus: eventBus,
        pattern: {source: ["newMessage"]},
        targets: [new LambdaFunction(ircClient)]

    })

    eventBus.grantPutEventsTo(ircClient)
}

function createLambda({scope, id, handler, entryPath}: lambdaParameters): NodejsFunction {
    return new NodejsFunction(scope, id, {
        runtime: lambda.Runtime.NODEJS_14_X,
        handler,
        entry: join(__dirname, entryPath),
        bundling: {
            minify: true
        }
    })
}

function createEventRule({scope, id, bus, pattern, targets}: eventRuleParameters): void {
    new events.Rule(scope, id, {
        eventBus: bus,
        eventPattern: pattern,
        targets: targets
    })
}


const app = new cdk.App()
new MyStack(app, "irc-stack", {
    stackName: "irc-stack"
})

