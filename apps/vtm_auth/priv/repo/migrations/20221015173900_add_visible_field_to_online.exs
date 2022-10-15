defmodule VtmAuth.Repo.Migrations.AddVisibleFieldToOnline do
  use Ecto.Migration

  def change do
    alter table(:sessions) do
      add :visible, :boolean, default: true
    end
  end
end
