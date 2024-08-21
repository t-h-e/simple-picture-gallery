# Simple Picture Gallery

A simple picture gallery. No database required. Photos can simply be stored in your file system. Add and remove photos. Simple picture gallery will automatically show them and create thumbnails.

## Getting Started

### Information

Folders should only contain images and folders. Folders should not contain any other files.

### Docker

The easiest way to run simple picture gallery is with docker.

```shell
docker build . -t simple-picture-gallery
docker run -p 3005:3001 -v /mnt/path/to/pictures:/usr/src/app/public --name my-picture-gallery simple-picture-gallery
```

#### Customization

Create an environment file `.env` containing any of the following properties to customize your gallery. All properties are optional. 

```properties
VITE_TITLE=My Gallery
VITE_APPBAR_COLOR=#F8AB2D
VITE_FAVICON_HREF=<URL to your favicon>
```

And run docker with `--env-file .env`

```shell
docker run -p 3005:3001 -v C:/DATA/temp/bla:/usr/src/app/public --env-file .env --name my-picture-gallery simple-picture-gallery
```

### nginx

It is recommended to use a cache for the API calls so that not every request has to read the file system again.

```nginx
http {

  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=picture_gallery_cache:10m max_size=100m inactive=60m use_temp_path=off;
  
  
  server {
    ...

    location / {
       proxy_pass http://127.0.0.1:3005;
    }

    location ~ /(images|directories|folderspreview) {
       proxy_cache picture_gallery_cache;
       proxy_cache_valid 200 302 600m;
       proxy_cache_min_uses 1;
       proxy_pass http://127.0.0.1:3005;
    }

    ...
  }
}
```