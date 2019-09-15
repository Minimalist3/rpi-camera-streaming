# rpi-camera-streaming
Low-latency Raspberry Pi Camera streaming

Works out of the box on Raspbian 2019-04.

This project was highly inspired by JSMPEG Rapsberry Pi example. I just bundled everything in a single NodeJS instance.

```
NodeJS --> FFMPEG --> Pipe --> WebSocket (8082)
       |
       \-> Express --> JSMPEG (8080)
```
