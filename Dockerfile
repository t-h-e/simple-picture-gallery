FROM node:16.14.2

WORKDIR /usr/src/app

COPY picture-gallery-client/package*.json picture-gallery-client/
COPY picture-gallery-server/package*.json picture-gallery-server/

# build client
WORKDIR /usr/src/app/picture-gallery-client
RUN npm ci --only=production
COPY picture-gallery-client .
RUN npm run build-client

# build server
WORKDIR /usr/src/app/picture-gallery-server
RUN npm ci --only=production
COPY picture-gallery-server .
RUN npm run build-server

RUN chown node:node -R /usr/src/app/picture-gallery-server/dist && \
    chown node:node -R /usr/src/app/picture-gallery-client/build

VOLUME /usr/src/app/public
EXPOSE 3001

USER node
# we are still in the server directory
CMD npm --prefix ../picture-gallery-client/ run set-environment && node dist/app.js