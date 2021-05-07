FROM registry.qunhequnhe.com/infra/base-builder-v12:latest as builder
RUN mkdir /approot
COPY . /approot
RUN cd /approot && \
yarn && \
cd /approot/app && \
yarn && \
yarn build


FROM registry.qunhequnhe.com/infra/node12:latest
RUN mkdir /approot
WORKDIR /approot
COPY --from=builder /approot /approot
RUN ls /approot

CMD scfConfig=${SCFCONFIG} stage=${STAGE} domain=${DOMAIN} region=${REGION} functions=${SELECTFUNCS} node ./server.js
