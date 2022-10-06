FROM gitpod/workspace-postgres

USER root

ENV DEBIAN_FRONTEND noninteractive

RUN sudo apt-get install curl software-properties-common apt-transport-https lsb-release -y \
    && curl -fsSL https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/erlang.gpg \
    && echo "deb https://packages.erlang-solutions.com/ubuntu $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/erlang.list \
    && apt-get update -y \
    && apt-get install erlang -y \
    && apt-get install elixir -y \
    && apt-get install inotify-tools -y \
    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

USER gitpod

RUN mix local.hex --force \
    && mix local.rebar --force \
    && mix archive.install hex phx_new
