defmodule VtmWeb.Releases do
  @moduledoc false

  @apps [:vtm_auth, :vtm]

  def migrate do
    for app <- @apps do
      path = Application.app_dir(app, "priv/repo/migrations")
      Ecto.Migrator.run(Vtm.Repo, path, :up, all: true)
    end
  end

  def rollback(version) do
    for app <- @apps do
      path = Application.app_dir(app, "priv/repo/migrations")
      Ecto.Migrator.run(Vtm.Repo, path, :down, to: version)
    end
  end

  def seed do
    for app <- @apps do
      path = Application.app_dir(app, "priv/repo") <> "/seeds.exs"
      Code.eval_file(path)
    end

    path = Application.app_dir(:vtm, "priv/repo") <> "/seeds_templates.exs"
    Code.eval_file(path)

    path = Application.app_dir(:vtm, "priv/repo") <> "/seeds_locations.exs"
    Code.eval_file(path)

    path = Application.app_dir(:vtm, "priv/repo") <> "/seeds_havens.exs"
    Code.eval_file(path)

    path = Application.app_dir(:vtm, "priv/repo") <> "/seeds_occupations.exs"
    Code.eval_file(path)
  end
end
