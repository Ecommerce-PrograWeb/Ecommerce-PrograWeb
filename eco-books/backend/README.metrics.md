**ELIMINAR DESPUÉS DE ACTUALIZAR EL README EN GIT**


Datadog metrics (quick start)

1) Ejecutar Datadog Agent en Docker (reemplaza DD_API_KEY por tu key)

```powershell
docker run -d --name dd-agent \
-e DD_API_KEY=YOUR_DATADOG_API_KEY \
-e DD_SITE="us5.datadoghq.com" \
-e DD_DOGSTATSD_NON_LOCAL_TRAFFIC=true \
-v /var/run/docker.sock:/var/run/docker.sock:ro \
-v /proc/:/host/proc/:ro \
-v /sys/fs/cgroup/:/host/sys/fs/cgroup:ro \
-v /var/lib/docker/containers:/var/lib/docker/containers:ro \
gcr.io/datadoghq/agent:7
```

2) Variables de entorno importantes para la app (archivo `.env`)

```
# Host donde está el DogStatsD (por defecto localhost)
DD_AGENT_HOST=127.0.0.1
# Puerto DogStatsD (por defecto 8125)
DD_DOGSTATSD_PORT=8125
# Opcional: prefijo para métricas
METRICS_PREFIX=eco_books.
# Para tests o si quieres deshabilitar métricas
DISABLE_METRICS=false
```

3) Qué mide la middleware

- `eco_books.http.request.duration_ms` (histograma): latencia en ms. Tags: method, endpoint, status.
- `eco_books.http.request.count` (contador): número de requests. Tags: method, endpoint, status.

4) Ver métricas en Datadog

En Datadog puedes crear un tablero con una query tipo:

```
sum:eco_books.http.request.count{*} by {endpoint,status}
```

y para latencia:

```
avg:eco_books.http.request.duration_ms{*} by {endpoint,status}
```
