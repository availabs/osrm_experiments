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

Update the docker-compose.yml file. You may need to change the container_name
and port if running more than one instance of this repo on a given host.

```diff
$ diff --git a/docker-compose.yml b/docker-compose.yml
index 2a5a1ec..f86bee3 100644
--- a/docker-compose.yml
+++ b/docker-compose.yml
@@ -2,9 +2,9 @@ version: '3'
 services:
     osrm_router:
       image: osrm/osrm-backend:latest
-      container_name: osrm_backend
+      container_name: osrm_backend_conflation_map_2021_v0_6_0
       ports:
-        - "5000:5000"
+        - "5001:5000"
       volumes:
         - ./host_mnt/data:/data
         - ./host_mnt/scripts:/scripts
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

It then copies the _avail-car-profile.lua_ file into _host_mnt/opt/_.
This profile includes a couple of modifications of the default car.lua profile.

1. Construction is not avoided while routing
2. Road names are replaced with OSM Way IDs.
    This facilitates the crosswalk to Conflation Map IDs or TMCs.

The [docker-compose.yml](docker-compose.yml) file then mounts these local directories back into the their original image directories.

This allows the local modifications to the Lua scripts to be accessible within the running OSRM containers.

### [build](build)

Preprocess the OSM data.

### [run](run)

Run a OSRM server. The default port is 5000 on the host. You can change this in [docker-compose.yml](docker-compose.yml).

## OSRM API Documentation

[HTTP API](http://project-osrm.org/docs/v5.22.0/api/#general-options)
