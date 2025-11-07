// src/config/datadog.js
import tracer from 'dd-trace';

/**
 * Inicializa Datadog APM (Application Performance Monitoring)
 * 
 * Esta configuración instrumenta automáticamente:
 * - Endpoints de Express (latencia, errores, throughput)
 * - Queries de MySQL/Sequelize
 * - Llamadas HTTP salientes
 * - Y más...
 */
export function initializeDatadog() {
  // Solo inicializar si está habilitado
  const enabled = process.env.DD_TRACE_ENABLED === 'true';
  
  if (!enabled) {
    console.log('[Datadog] APM deshabilitado (DD_TRACE_ENABLED != true)');
    return null;
  }

  try {
    tracer.init({
      // Nombre del servicio en Datadog
      service: process.env.DD_SERVICE || 'eco-books-backend',
      
      // Entorno (development, staging, production)
      env: process.env.DD_ENV || process.env.NODE_ENV || 'development',
      
      // Versión de la app (útil para correlacionar con deploys)
      version: process.env.DD_VERSION || '1.0.0',
      
      // URL del Datadog Agent (en Docker: nombre del servicio)
      hostname: process.env.DD_AGENT_HOST || 'datadog-agent',
      port: process.env.DD_TRACE_AGENT_PORT || '8126',
      
      // Configuración de logging
      logInjection: true, // Inyecta trace_id y span_id en logs
      
      // Configuración de APM
      runtimeMetrics: true, // Métricas de runtime (CPU, memoria, GC)
      profiling: true, // Habilitar profiling continuo
      
      // Plugins - instrumentación automática
      plugins: true, // Habilitar todos los plugins por defecto
      
      // Configuración de sampling (100% en dev, ajustar en prod)
      sampleRate: parseFloat(process.env.DD_TRACE_SAMPLE_RATE || '1.0'),
      
      // Analytics
      analytics: true,
      
      // Tags globales (útiles para filtrar en Datadog)
      tags: {
        team: 'ecobooks',
        component: 'backend',
      },
    });

    console.log('[Datadog] ✅ APM inicializado correctamente');
    console.log(`[Datadog] Service: ${process.env.DD_SERVICE || 'eco-books-backend'}`);
    console.log(`[Datadog] Environment: ${process.env.DD_ENV || 'development'}`);
    console.log(`[Datadog] Agent: ${process.env.DD_AGENT_HOST || 'datadog-agent'}:${process.env.DD_TRACE_AGENT_PORT || '8126'}`);
    
    return tracer;
  } catch (error) {
    console.error('[Datadog] ❌ Error al inicializar APM:', error);
    return null;
  }
}

/**
 * Obtener el tracer (para crear spans manuales si es necesario)
 */
export function getTracer() {
  return tracer;
}

/**
 * Crear span manual para operaciones específicas
 * 
 * Ejemplo:
 * const span = createSpan('custom.operation', { tag: 'value' });
 * try {
 *   // ... tu código
 *   span.setTag('result', 'success');
 * } catch (error) {
 *   span.setTag('error', error);
 * } finally {
 *   span.finish();
 * }
 */
export function createSpan(operationName, tags = {}) {
  const tracer = getTracer();
  const span = tracer.startSpan(operationName, {
    tags: {
      ...tags,
    },
  });
  return span;
}

export default { initializeDatadog, getTracer, createSpan };
