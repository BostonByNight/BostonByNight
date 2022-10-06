FROM gitpod/workspace-postgres

ENV DEBIAN_FRONTEND noninteractive

USER root

RUN sudo apt-get install curl software-properties-common apt-transport-https lsb-release -y \
    && curl -fsSL https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/erlang.gpg \
    && echo "deb https://packages.erlang-solutions.com/ubuntu $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/erlang.list \
    && sudo apt-get update -y \
    && sudo apt-get install erlang -y \
    && sudo apt-get install elixir -y \
    && sudo apt-get install inotify-tools -y \
    && sudo apt-get clean && sudo rm -rf /var/cache/apt/* && sudo rm -rf /var/lib/apt/lists/* && sudo rm -rf /tmp/*

USER gitpod

RUN mix local.hex --force \
    && mix local.rebar --force \
    && mix archive.install hex phx_new

RUN chmod +x /gitpod/BostonByNight/.gitpod/init.sh

RUN chmod +x /gitpod/BostonByNight/.gitpod/start.sh
