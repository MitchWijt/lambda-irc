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
        ircClientStack(this)
    }
}

function ircClientStack(scope: cdk.Stack) {
    const ircMessageEventHandler = createLambda({
        scope,
        id: "ircMessageEventHandler",
        handler: "clientHandler",
        entryPath: "../src/message-event-handler/handler.ts"
    })

    const eventBus = new events.EventBus(scope, "irc-eventbus")
    createEventRule({
        scope,
        id: "emit-message-rule",
        bus: eventBus,
        pattern: {source: ["newMessage"]},
        targets: [new LambdaFunction(ircMessageEventHandler)]

    })

    const ircMessageEventProducer = createLambda({
        scope,
        id: "ircMessageEventProducer",
        handler: "handler",
        entryPath: "../src/message-event-producer/handler.ts"
    })
    new apiGateway.LambdaRestApi(scope, "irc-server-gateway", {
        handler: ircMessageEventProducer
    })

    eventBus.grantPutEventsTo(ircMessageEventProducer)
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

