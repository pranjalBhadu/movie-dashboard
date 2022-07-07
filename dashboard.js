const { NodeTracerProvider } = require('@opentelemetry/node')
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { trace }  = require("@opentelemetry/api");

const express = require('express')
const app = express()
const port = 3001

const provider = new NodeTracerProvider()
const consoleExporter = new ConsoleSpanExporter()
const spanProcessor = new SimpleSpanProcessor(consoleExporter)

provider.addSpanProcessor(spanProcessor)
provider.register()
trace.setGlobalTracerProvider(provider)

const name = 'show-movies'
const version = '0.1.0'
const tracer = trace.getTracer(name, version)

const getUrlContents = (url, fetch) => {
    return new Promise((resolve, reject) => { 
        const span = tracer.startSpan("getting movies fetched")
        fetch(url, resolve, reject)
        .then(res => res.text())
        .then(body => resolve(body))
        span.end()
    })
  }

app.get('/', async function(req, res){
    const span = tracer.startSpan("movies on dashboard")
    const movies = await getUrlContents("http://localhost:3000/", require('node-fetch'))
    res.type('json')
    res.send(JSON.stringify({dashboard: movies}))
    span.end()
})

app.listen(port, () => { console.log(`Listening at http://localhost:${port}`)})