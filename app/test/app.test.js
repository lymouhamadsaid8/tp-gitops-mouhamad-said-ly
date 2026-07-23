const test = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../app');

test('GET /healthz retourne 200 et status ok', async () => {
  const res = await request(app).get('/healthz');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
});

test('GET / retourne 200 et contient le nom de l\'etudiant', async () => {
  const res = await request(app).get('/');
  assert.strictEqual(res.status, 200);
  assert.match(res.text, /Mouhamad Said Ly/);
});

test('GET /metrics expose les metriques prometheus', async () => {
  const res = await request(app).get('/metrics');
  assert.strictEqual(res.status, 200);
  assert.match(res.text, /app_http_requests_total/);
});
