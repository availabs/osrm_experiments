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

Additionally, this script downloads the [wayids.lua](https://gist.github.com/ZsoltMedgyesi-Itineris/a50efd2a65456a6ec5ae72fd0a35d76d)
  script into _./host_mnt/opt_, which is mounted as _/opt/_ in the Docker containers.
  This Lua script replaces OSM Way names with IDs in the OSRM routing output.
  See Project-OSRM/osrm-backend Issue [OSRM return way id instead of name #5202](https://github.com/Project-OSRM/osrm-backend/issues/5202#issuecomment-440580574) for details.

### [build](build)

Preprocess the OSM data.

### [run](run)

Run a OSRM server. The default port is 5000 on the host. You can change this in [docker-compose.yml](docker-compose.yml).

## OSRM API Documentation

[HTTP API](http://project-osrm.org/docs/v5.22.0/api/#general-options)

## OneWay Ways Routing Issue

* [Improve Tie-Breaking on Phantom Node Snapping on Oneway Segments #2167](https://github.com/Project-OSRM/osrm-backend/issues/2167)
* [Snapping to intersections incurs random turn penalty costs #4465](https://github.com/Project-OSRM/osrm-backend/issues/4465)
* [Routing from exact node location #5073](https://github.com/Project-OSRM/osrm-backend/issues/5073#issuecomment-387753249)
* [Processing-Flow](https://github.com/Project-OSRM/osrm-backend/wiki/Processing-Flow)

