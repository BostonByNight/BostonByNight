FROM elixir:1.13.1-alpine AS build

RUN apk add --no-cache build-base nodejs yarn python3 git && \
    mix local.hex --force && \
    mix local.rebar --force

ARG db_url
ARG secret_key
ARG mail_smtps_server
ARG mail_port
ARG mail_user
ARG mail_pass

# set build ENV
ENV MIX_ENV=prod
ENV DATABASE_URL=$db_url
ENV SECRET_KEY_BASE=$secret_key
ENV MAIL_HOST=$mail_smtps_server
ENV MAIL_PORT=$mail_port
ENV MAIL_USER=$mail_user
ENV MAIL_PASS=$mail_pass

# from https://github.com/TobiasDeBruijn/SkinFixer-API/blame/aeda56fd5a227d5ab5de32754b1137a0bf67a686/Dockerfile
ENV GLIBC_REPO=https://github.com/sgerrand/alpine-pkg-glibc
ENV GLIBC_VERSION=2.30-r0
RUN set -ex && \
    apk --update add libstdc++ curl ca-certificates && \
    for pkg in glibc-${GLIBC_VERSION} glibc-bin-${GLIBC_VERSION}; \
        do curl -sSL ${GLIBC_REPO}/releases/download/${GLIBC_VERSION}/${pkg}.apk -o /tmp/${pkg}.apk; done && \
    apk add --allow-untrusted /tmp/*.apk && \
    rm -v /tmp/*.apk && \
    /usr/glibc-compat/sbin/ldconfig /lib /usr/glibc-compat/lib

WORKDIR /build

COPY mix.exs config/ ./
COPY apps/vtm_web/mix.exs ./apps/vtm_web/
COPY apps/vtm/mix.exs ./apps/vtm/
COPY apps/vtm_auth/mix.exs ./apps/vtm_auth/

RUN echo ${secret_key}

RUN HEX_HTTP_CONCURRENCY=4 HEX_HTTP_TIMEOUT=10000 mix deps.get --only prod && \
    mix deps.compile

COPY . .

RUN yarn --cwd apps/vtm_web/assets install --pure-lockfile

RUN yarn --cwd apps/vtm_web/assets build && \
    cd apps/vtm_web && mix phx.digest

WORKDIR /build/apps/vtm_web

RUN mix phx.digest

WORKDIR /build

RUN mix compile && mix release

# prepare release image
FROM alpine:3.13.6 AS app

RUN apk add --no-cache libgcc libstdc++ ncurses ncurses-libs

RUN addgroup -S release && \
    adduser -S -G release release && \
    mkdir /release && \
    chown -R release: /release

WORKDIR /release

COPY --from=build --chown=release:release /build/_build/prod/rel/vtm .

USER release

EXPOSE 4000

CMD ["bin/vtm", "start"]