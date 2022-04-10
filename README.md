# Simple Picture Gallery

## Getting Started

### Docker

```shell
docker build . -t simple-picture-gallery
docker run -p 3005:3001 -v /mnt/data/pictures:/usr/src/app/public --name my-picture-gallery simple-picture-gallery
```

### Customization

Create an environment file `.env`:

```properties
REACT_APP_TITLE=My Gallery
REACT_APP_APPBAR_COLOR=#F8AB2D
```

And run docker with `--env-file .env`

```shell
docker run -p 3005:3001 -v //c/DATA/temp/bla:/usr/src/app/public --env-file .env --name my-picture-gallery simple-picture-gallery
```