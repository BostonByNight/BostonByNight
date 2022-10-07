defmodule VtmAuth.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    children = [
      # Start the Ecto repository
      VtmAuth.Repo,
      # Start the PubSub system
      {Phoenix.PubSub, name: VtmAuth.PubSub}
      # Start a worker by calling: VtmAuth.Worker.start_link(arg)
      # {VtmAuth.Worker, arg}
    ]

    Supervisor.start_link(children, strategy: :one_for_one, name: VtmAuth.Supervisor)
  end
end
