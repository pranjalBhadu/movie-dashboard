const { NodeTracerProvider } = require('@opentelemetry/node')
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { trace }  = require("@opentelemetry/api");

const express = require('express')
const app = express()
const port = 3000

const provider = new NodeTracerProvider()
const consoleExporter = new ConsoleSpanExporter()
const spanProcessor = new SimpleSpanProcessor(consoleExporter)

provider.addSpanProcessor(spanProcessor)
provider.register()
trace.setGlobalTracerProvider(provider)


const name = 'send-movies'
const version = '0.1.0'
const tracer = trace.getTracer(name, version)

app.get('/', async function(req, res){
    const span = tracer.startSpan("send movies json")
    res.type('json')
    res.send(({
        movies: [
            { name: 'Jaws', genre: 'Thriller'}, 
            { name: 'Annie', genre: 'Family'},
            { name: 'Jurassic Park', genre: 'Action'},
        ]
    }))
    span.end()
})

app.listen(port, () => { console.log(`Listening at http://localhost:${port}`)})