FROM node:12.16.1 as build

WORKDIR /usr/build
COPY    .   .

RUN     yarn install --immutable --immutable-cache --inline-builds && yarn build

FROM	mhart/alpine-node:12.18

ENV     NODE_ENV    "production"

WORKDIR /usr/app
COPY --from=build /usr/build/package.json   .
COPY --from=build /usr/build/dist   ./dist
COPY --from=build /usr/build/.next   ./.next

COPY --from=build /usr/build/.yarn   ./.yarn
COPY --from=build /usr/build/.yarnrc.yml   .
COPY --from=build /usr/build/.pnp.js   .

EXPOSE 3000

CMD		["yarn", "node", "dist/server"]
