# co2-mini

Read data from a CO2 monitor device "CO2-mini" via USB

## Architecture

```mermaid
flowchart LR
    C[CO2-mini]

    subgraph "Remote machine (in monitor directory)"
        subgraph "Docker (remote)"
            G[Grafana]
            I[InfluxDB]
        end
    end

    subgraph "Local machine (in sensor directory)"
        N[Node.js program]
        subgraph "Docker (local)"
            T[Telegraf]
        end
    end

    C -- Send CO2 and temperature data --> N
    N -- Send data --> I
    G -- Visualize --> I
```

## Setup (Remote machine)

Create `monitor/myInfluxDBVolume` directory.

Create `.env` file.

```
DOCKER_INFLUXDB_INIT_MODE=setup
DOCKER_INFLUXDB_INIT_USERNAME=
DOCKER_INFLUXDB_INIT_PASSWORD=
DOCKER_INFLUXDB_INIT_ORG=
DOCKER_INFLUXDB_INIT_BUCKET=
GF_SERVER_ROOT_URL=http://localhost:8080
GF_SECURITY_ADMIN_PASSWORD=
```

Move to "monitor" directory.

Run `docker compose --env-file=../.env up`.

## Setup (Local machine)

Create `external` network.

```
docker network create external
```

TODO: This network setting is for test in local environment.

Create `sensor/telegraf.conf`.

```
[[inputs.socket_listener]]
    service_address = "udp://:8092"
    data_format = "influx"

[[outputs.influxdb_v2]]
    token = "${INFLUXDB_TOKEN}"
    organization = "${INFLUXDB_ORG}"
    bucket = "${INFLUXDB_BUCKET}"
```

SET "INFLUXDB_URL" environment variable. Check it with `docker network inspect external`.

```
$ENV:INFLUXDB_URL = "http://<IP_ADDR>:8086"
```

Set "INFLUXDB_TOKEN" environment variable.

```
$ENV:INFLUXDB_TOKEN = "<TOKEN>"
```

Move to "sensor" directory.

Run `docker compose --env-file=../.env up`.

TODO: Telagraf is not used now.

Set "INFLUXDB_ORG" environment variable.

```
$ENV:INFLUXDB_ORG = "<ORG>"
```

Set "INFLUXDB_BUCKET" environment variable.

```
$ENV:INFLUXDB_BUCKET = "<BUCKET>"
```

Run `tsc ./src`

Run `node ./dist/main.js`
