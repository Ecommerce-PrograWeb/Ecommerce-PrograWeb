import StatsD from 'hot-shots';

// No enviar métricas en entornos de test o si explicitamente deshabilitado
const DISABLE_METRICS = process.env.DISABLE_METRICS === 'true' || process.env.NODE_ENV === 'test';

// Configuración por defecto: asume agent en localhost:8125
const statsd = DISABLE_METRICS
  ? null
  : new StatsD({
      host: process.env.DD_AGENT_HOST || 'host.docker.internal',
      port: process.env.DD_DOGSTATSD_PORT ? Number(process.env.DD_DOGSTATSD_PORT) : 8125,
      prefix: process.env.METRICS_PREFIX || 'eco_books.',
      // permitir no lanzar errores en caso de que no haya agente
      maxBufferSize: 0,
    });

function getRouteTag(req) {
  // intenta obtener el path de la ruta (pattern) para agrupar endpoints
  try {
    if (req.route && req.route.path) {
      // si la ruta está montada en un router con base
      const base = req.baseUrl || '';
      return `${base}${req.route.path}`.replace(/\/\//g, '/');
    }
    // fallback: originalUrl sin query
    return req.originalUrl ? req.originalUrl.split('?')[0] : req.path;
  } catch (e) {
    return req.path || 'unknown';
  }
}

export default function metricsMiddleware(req, res, next) {
  if (DISABLE_METRICS) return next();

  const start = process.hrtime();

  function onFinish() {
    res.removeListener('finish', onFinish);
    res.removeListener('close', onFinish);

    const diff = process.hrtime(start);
    const durationMs = diff[0] * 1000 + diff[1] / 1e6; // ms

    const route = getRouteTag(req);
    const tags = [`method:${req.method}`, `endpoint:${route}`, `status:${res.statusCode}`];

    try {
      // Histograma de latencia
      statsd.histogram('http.request.duration_ms', durationMs, tags);
      // Contador por request
      statsd.increment('http.request.count', 1, tags);
    } catch (e) {
      // no romper la app si no hay agente
      // console.debug('metrics send error', e);
    }
  }

  res.on('finish', onFinish);
  res.on('close', onFinish);

  next();
}