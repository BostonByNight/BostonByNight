defmodule VtmWeb.Releases do
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

    path = Application.app_dir(:vtm, "priv/repo") <> "/template_seeds.ex"
    Code.eval_file(path)
  end
end
