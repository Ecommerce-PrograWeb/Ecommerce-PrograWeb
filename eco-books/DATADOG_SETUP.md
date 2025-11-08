# 🐕 Guía de Integración Datadog APM - EcoBooks

## 📋 Tabla de Contenidos
1. [¿Qué es Datadog?](#qué-es-datadog)
2. [Configuración](#configuración)
3. [Inicio Rápido](#inicio-rápido)
4. [Opciones de Uso](#opciones-de-uso)
5. [Qué Puedes Monitorear](#qué-puedes-monitorear)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 ¿Qué es Datadog?

Datadog es una plataforma de monitoreo que te permite:
- ✅ **Monitorear endpoints**: Ver latencia, throughput, errores de cada endpoint
- ✅ **Trazar requests**: Ver el flujo completo de una petición (Express → Sequelize → MySQL)
- ✅ **Métricas de performance**: CPU, memoria, GC del proceso Node.js
- ✅ **Detectar cuellos de botella**: Queries lentas, endpoints con problemas
- ✅ **Logs correlacionados**: Ver logs asociados a cada request

---

## ⚙️ Configuración

### Opción 1: Datadog Local (Sin cuenta Datadog)

**Ideal para desarrollo local. No necesitas crear cuenta.**

Solo necesitas ejecutar el Datadog Agent en Docker:

```bash
cd eco-books
docker-compose up datadog-agent backend
```

Luego accede a:
- **Datadog UI Local**: El agent NO tiene UI web por defecto
- **Ver trazas**: Las trazas se almacenan localmente en el agent
- **Para visualizar**: Usa logs en consola o configura un exporter

**Ventajas:**
- ✅ No necesitas cuenta
- ✅ Todo local
- ✅ Gratis

**Desventajas:**
- ❌ No hay UI visual bonita
- ❌ Solo ves logs en terminal

### Opción 2: Datadog SaaS (Con cuenta gratuita)

**Ideal si quieres ver UI completa con gráficos, dashboards, alertas.**

#### Paso 1: Crear cuenta gratuita
1. Ve a https://www.datadoghq.com/
2. Crea cuenta gratuita (14 días trial, luego plan free limitado)
3. Una vez dentro, ve a **Organization Settings → API Keys**
4. Copia tu API Key

#### Paso 2: Configurar API Key
Edita el archivo `docker-compose.yml`:

```yaml
datadog-agent:
  environment:
    DD_API_KEY: "tu_api_key_aqui"  # <-- Descomenta y pega tu key
```

O mejor, crea un archivo `.env` en la raíz:

```bash
# .env
DD_API_KEY=tu_api_key_aqui
```

Y en `docker-compose.yml`:
```yaml
datadog-agent:
  environment:
    DD_API_KEY: ${DD_API_KEY}
```

#### Paso 3: Iniciar servicios
```bash
docker-compose up -d
```

#### Paso 4: Acceder a Datadog UI
1. Ve a https://app.datadoghq.com/
2. Navega a **APM → Services**
3. Verás tu servicio `eco-books-backend`
4. Click para ver métricas, trazas, endpoints

---

## 🚀 Inicio Rápido

### 1. Instalar dependencias (si no lo hiciste)
```bash
cd backend
npm install
```

### 2. Iniciar con Docker Compose
```bash
cd eco-books
docker-compose up -d
```

### 3. Verificar que funciona
Chequea los logs del backend:
```bash
docker-compose logs -f backend
```

Deberías ver:
```
[Datadog] ✅ APM inicializado correctamente
[Datadog] Service: eco-books-backend
[Datadog] Environment: development
[Datadog] Agent: datadog-agent:8126
```

### 4. Generar tráfico
Haz requests a tus endpoints:
```bash
# Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'

# Obtener libros
curl http://localhost:3000/book
```

### 5. Ver trazas en logs (Opción 1) o en Datadog UI (Opción 2)

**Opción 1 - Logs:**
```bash
docker-compose logs -f datadog-agent | grep trace
```

**Opción 2 - Datadog UI:**
1. Ve a https://app.datadoghq.com/apm/services
2. Click en `eco-books-backend`
3. Verás:
   - Requests por segundo
   - Latencia promedio (p50, p95, p99)
   - Errores
   - Lista de endpoints más lentos

---

## 📊 Qué Puedes Monitorear

### 1. Endpoints de Express

Datadog automáticamente instrumenta **TODOS** tus endpoints:

```
POST /auth/register
POST /auth/login
GET  /book
GET  /book/:id
POST /cart
GET  /users
...
```

Para cada uno verás:
- **Latencia**: ¿Cuánto tarda en responder?
- **Throughput**: ¿Cuántas requests por segundo?
- **Error rate**: ¿Qué % de requests fallan?
- **Status codes**: Distribución de 200, 400, 500, etc.

### 2. Queries de Base de Datos

Cada query SQL se rastrea automáticamente:

```sql
SELECT * FROM User WHERE email = ?
INSERT INTO Book ...
UPDATE Cart SET ...
```

Verás:
- Tiempo de ejecución de cada query
- Qué endpoint llamó esa query
- Queries N+1 (cuando haces muchas queries en loop)

### 3. Métricas de Runtime (Node.js)

- **CPU usage**: % de CPU usado
- **Memory**: Heap usado, RSS, External
- **Garbage Collection**: Tiempo en GC, frecuencia
- **Event Loop Lag**: Si el event loop está bloqueado

### 4. Trazas Distribuidas

Si en el futuro agregas microservicios o llamadas a APIs externas, Datadog rastrea todo el flujo:

```
Frontend → Backend → MySQL
          ↓
          API Externa (Stripe, SendGrid, etc)
```

### 5. Logs Correlacionados

Si usas `console.log()`, Datadog automáticamente inyecta:
- `trace_id`: ID de la traza
- `span_id`: ID del span actual

Esto te permite buscar logs de una request específica.

---

## 🔧 Configuración Avanzada

### Crear Spans Manuales

Si quieres rastrear una operación específica:

```javascript
import { createSpan } from '../config/datadog.js';

export async function procesarPago(userId, amount) {
  const span = createSpan('payment.process', {
    user_id: userId,
    amount: amount
  });
  
  try {
    // Tu lógica de pago
    const result = await stripeAPI.charge(amount);
    
    span.setTag('payment_id', result.id);
    span.setTag('status', 'success');
    
    return result;
  } catch (error) {
    span.setTag('error', true);
    span.setTag('error.message', error.message);
    throw error;
  } finally {
    span.finish();
  }
}
```

### Agregar Tags Personalizados

En `backend/src/config/datadog.js`:

```javascript
tags: {
  team: 'ecobooks',
  component: 'backend',
  version: '1.0.0',
  region: 'us-east-1',  // Agregar más tags
}
```

### Filtrar Endpoints Sensibles

Si NO quieres rastrear ciertos endpoints (ej: health checks):

```javascript
tracer.init({
  // ... otras opciones
  
  // Filtrar por URL
  blocklist: ['/health', '/ping'],
  
  // O por regex
  blocklist: /^\/(health|ping|metrics)/,
});
```

---

## 📈 Dashboards Recomendados (Datadog UI)

Una vez en Datadog, crea estos dashboards:

### 1. Dashboard de Autenticación
- Requests a `/auth/login` y `/auth/register`
- Tasa de éxito/fallo
- Latencia promedio
- Usuarios registrados por hora

### 2. Dashboard de Productos
- Requests a `/book`
- Latencia de búsqueda
- Productos más vistos
- Errores en checkout

### 3. Dashboard de Base de Datos
- Top 10 queries más lentas
- Tiempo promedio de queries
- Conexiones activas
- Deadlocks (si hay)

### 4. Dashboard de Errores
- Rate de errores 4xx y 5xx
- Stack traces más comunes
- Endpoints con más errores

---

## 🐛 Troubleshooting

### No veo trazas en Datadog

**1. Verificar que el agent está corriendo:**
```bash
docker-compose ps datadog-agent
```

Debe estar `Up`.

**2. Verificar logs del agent:**
```bash
docker-compose logs datadog-agent
```

Busca errores.

**3. Verificar que el backend se conecta:**
```bash
docker-compose logs backend | grep Datadog
```

Deberías ver:
```
[Datadog] ✅ APM inicializado correctamente
```

**4. Verificar conectividad:**
```bash
docker-compose exec backend ping datadog-agent
```

Debe responder.

**5. Verificar variables de entorno:**
```bash
docker-compose exec backend env | grep DD_
```

Deberías ver:
```
DD_TRACE_ENABLED=true
DD_AGENT_HOST=datadog-agent
DD_SERVICE=eco-books-backend
...
```

### Error: "Cannot find module 'dd-trace'"

```bash
cd backend
npm install dd-trace
docker-compose restart backend
```

### El agent usa mucha RAM

Esto es normal en Docker. El agent consume ~150-300MB.

Para reducir:
```yaml
datadog-agent:
  environment:
    DD_PROCESS_AGENT_ENABLED: "false"  # Deshabilitar process monitoring
    DD_LOGS_ENABLED: "false"            # Deshabilitar logs si no los usas
```

### No quiero usar Datadog ahora

Deshabilita APM sin borrar código:

```yaml
backend:
  environment:
    DD_TRACE_ENABLED: "false"  # <-- Cambiar a false
```

O comenta el servicio datadog-agent:

```yaml
# datadog-agent:
#   image: gcr.io/datadoghq/agent:7
#   ...
```

---

## 📊 Ejemplo de Métricas que Verás

### Endpoint: `POST /auth/login`
```
Requests:     1,234 req/h
Latency p50:  45ms
Latency p95:  120ms
Latency p99:  350ms
Error rate:   2.3%
Throughput:   20.5 req/s

Top Errors:
- 401 Unauthorized (52%)
- 500 Internal Server Error (45%)
- 400 Bad Request (3%)

Slowest Operations:
1. mysql.query (SELECT ... FROM User) - 35ms
2. jwt.sign - 8ms
3. bcrypt.compare - 5ms
```

### Query: `SELECT * FROM Book WHERE ...`
```
Executions:   5,432
Avg duration: 12ms
Max duration: 145ms
P95:          45ms

Called from:
- GET /book (78%)
- GET /search (15%)
- POST /cart (7%)
```

---

## 🎓 Aprende Más

### Documentación Oficial
- [Datadog APM Node.js](https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/)
- [Datadog Agent Docker](https://docs.datadoghq.com/agent/docker/)
- [dd-trace GitHub](https://github.com/DataDog/dd-trace-js)

### Tutoriales
- [Getting Started with APM](https://docs.datadoghq.com/getting_started/tracing/)
- [Custom Instrumentation](https://docs.datadoghq.com/tracing/custom_instrumentation/nodejs/)

---

## ✅ Checklist Post-Instalación

- [ ] `npm install` ejecutado en backend
- [ ] Variables `DD_*` configuradas en docker-compose.yml
- [ ] Datadog agent corriendo (`docker-compose ps`)
- [ ] Backend muestra logs de Datadog
- [ ] Trazas aparecen en Datadog UI (si usas SaaS)
- [ ] Endpoints instrumentados automáticamente
- [ ] Queries MySQL aparecen en trazas

---

## 🎉 ¡Listo!

Ahora tienes Datadog integrado y puedes:

1. **Ver en tiempo real** cómo se comportan tus endpoints
2. **Identificar queries lentas** que hacen lento tu API
3. **Detectar errores** antes que los usuarios los reporten
4. **Optimizar** basándote en datos reales, no suposiciones

**Pro tip:** Genera mucho tráfico (usa un script de requests) para ver métricas más interesantes.

---

**Fecha:** Noviembre 3, 2025  
**Autor:** GitHub Copilot  
**Versión:** 1.0.0
