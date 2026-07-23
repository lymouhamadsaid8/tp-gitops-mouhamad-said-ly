const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const client = require('prom-client');

const APP_VERSION = process.env.APP_VERSION || 'dev';
const BUILD_DATE = process.env.BUILD_DATE || 'inconnue';
const NAMESPACE = process.env.POD_NAMESPACE || 'default';
const POD_NAME = process.env.POD_NAME || os.hostname();

const app = express();

client.collectDefaultMetrics();
const httpRequestsTotal = new client.Counter({
  name: 'app_http_requests_total',
  help: 'Nombre total de requetes HTTP recues',
  labelNames: ['route', 'method', 'status']
});
const httpDuration = new client.Histogram({
  name: 'app_http_request_duration_seconds',
  help: 'Duree des requetes HTTP en secondes',
  labelNames: ['route']
});

app.use((req, res, next) => {
  const end = httpDuration.startTimer({ route: req.path });
  res.on('finish', () => {
    httpRequestsTotal.inc({ route: req.path, method: req.method, status: res.statusCode });
    end();
  });
  next();
});

app.get('/', (req, res) => {
  const template = fs.readFileSync(path.join(__dirname, 'public', 'index.html'), 'utf8');
  const html = template
    .replaceAll('{{VERSION}}', APP_VERSION)
    .replaceAll('{{BUILD_DATE}}', BUILD_DATE)
    .replaceAll('{{NAMESPACE}}', NAMESPACE)
    .replaceAll('{{POD_NAME}}', POD_NAME);
  res.send(html);
});

app.get('/healthz', (req, res) => res.status(200).json({ status: 'ok' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

module.exports = app;
