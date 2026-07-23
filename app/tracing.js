try {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
  const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

  process.env.OTEL_SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'gitops-app-mouhamad-said-ly';

  const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
    || 'http://otel-collector.observabilite.svc.cluster.local:4318/v1/traces';

  const sdk = new NodeSDK({
    traceExporter: new OTLPTraceExporter({ url: endpoint }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('OpenTelemetry initialise avec succes');
} catch (err) {
  console.error('OpenTelemetry non demarre (non bloquant):', err.message);
}
