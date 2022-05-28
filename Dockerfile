FROM node:16.14.2-alpine as client-builder

COPY picture-gallery-client/package*.json /usr/src/app/picture-gallery-client/
WORKDIR /usr/src/app/picture-gallery-client
RUN npm ci --only=production
COPY picture-gallery-client .
RUN npm run build-client

RUN mkdir built && \
    mv build built && \
    mv package.minimize.docker.json built/package.json && \
    cp package-lock.json built && \
    npm --prefix built/ ci --only=production

FROM node:16.14.2-alpine as server-builder

COPY picture-gallery-server/package*.json /usr/src/app/picture-gallery-server/
WORKDIR /usr/src/app/picture-gallery-server
RUN npm ci
COPY picture-gallery-server .
RUN npm run build-server

RUN mkdir built && \
    mv dist node_modules built

FROM node:16.14.2-alpine

COPY --from=client-builder --chown=node:node /usr/src/app/picture-gallery-client/built /usr/src/app/picture-gallery-client/
COPY --from=server-builder --chown=node:node /usr/src/app/picture-gallery-server/built /usr/src/app/picture-gallery-server/

VOLUME /usr/src/app/public
EXPOSE 3001

USER node
WORKDIR /usr/src/app/picture-gallery-server
CMD npm --prefix ../picture-gallery-client/ run set-environment && node dist/app.js