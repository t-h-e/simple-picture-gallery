FROM node:16.14.2 as client-builder

WORKDIR /usr/src/app
COPY picture-gallery-client/package*.json picture-gallery-client/
WORKDIR /usr/src/app/picture-gallery-client
RUN npm ci --only=production
COPY picture-gallery-client .
RUN npm run build-client

FROM node:16.14.2 as server-builder

WORKDIR /usr/src/app
COPY picture-gallery-server/package*.json picture-gallery-server/
WORKDIR /usr/src/app/picture-gallery-server
RUN npm ci
COPY picture-gallery-server .
RUN npm run build-server

FROM node:16.14.2

WORKDIR /usr/src/app

COPY picture-gallery-client/package*.json picture-gallery-client/
COPY picture-gallery-server/package*.json picture-gallery-server/

COPY --from=client-builder /usr/src/app/picture-gallery-client/build /usr/src/app/picture-gallery-client/build
COPY --from=server-builder /usr/src/app/picture-gallery-server/dist /usr/src/app/picture-gallery-server/dist

RUN chown node:node -R /usr/src/app/picture-gallery-client/build && \
    chown node:node -R /usr/src/app/picture-gallery-server/dist

# only needed for "react-inject-env"
WORKDIR /usr/src/app/picture-gallery-client
RUN npm ci --only=production

WORKDIR /usr/src/app/picture-gallery-server
RUN npm ci --only=production

VOLUME /usr/src/app/public
EXPOSE 3001

USER node
# we are still in the server directory
CMD npm --prefix ../picture-gallery-client/ run set-environment && node dist/app.js