FROM gitpod/workspace-postgres

USER root

ENV DEBIAN_FRONTEND noninteractive

RUN sudo apt install curl software-properties-common apt-transport-https lsb-release \
    && curl -fsSL https://packages.erlang-solutions.com/ubuntu/erlang_solutions.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/erlang.gpg \
    && echo "deb https://packages.erlang-solutions.com/ubuntu $(lsb_release -cs) contrib" | sudo tee /etc/apt/sources.list.d/erlang.list \
    && apt update \
    && apt install erlang -y \
    && apt-get install elixir -y \
    && apt-get install inotify-tools -y \
    && mix local.hex --force \
    && mix local.rebar --force \
    && mix archive.install hex phx_new \
    && apt-get clean && rm -rf /var/cache/apt/* && rm -rf /var/lib/apt/lists/* && rm -rf /tmp/*

# Allow gitpod group to edit 
RUN true \
	&& chown -R root:gitpod /home/gitpod/.mix \
    && chmod -R g+rw /home/gitpod/.mix
