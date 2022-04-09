# Simple Picture Gallery

## Getting Started

### Docker

```shell
docker build . -t simple-picture-gallery
docker run -p 3005:3001 -v //c/DATA/mypictures:/usr/src/app/picture-gallery-server/public --name test-gallery simple-picture-gallery
```