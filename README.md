# osrm_experiments

## Instructions


Provide the OSM file

```
mkdir -p ./host_mnt/data
# Copy your OSM PBF file into ./host_mnt/data
```

Preprocess the OSM file.

```
./init
./build
```

Run the OSRM server.

```
./run
```

## The files

### [init](init)

This script copies the OSRM Lua scripts in the _/opt_ and _/usr/local/share/osrm/profiles_ directories
  of the [osrm/osrm-backend:latest](https://hub.docker.com/r/osrm/osrm-backend) Docker image into 
  the local _./host_mnt/opt_ and _./host_mnt/osrm_profiles_ directories, respectively.
The [docker-compose.yml](docker-compose.yml) file then mounts these local directories back into the their original image directories.
This allows the local modifications to the Lua scripts to be accessible within the running OSRM containers.

### [build](build)

Preprocess the OSM data.

### [run](run)

Run a OSRM server. The default port is 5000 on the host. You can change this in [docker-compose.yml](docker-compose.yml).
