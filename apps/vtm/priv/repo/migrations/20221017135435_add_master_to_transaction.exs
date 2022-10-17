defmodule Vtm.Repo.Migrations.AddMasterToTransaction do
  use Ecto.Migration

  def change do
    alter table(:transactions) do
      add :master_user_id, references(:users, on_delete: :nothing), null: false
    end

    create index(:transactions, [:master_user_id])
  end
end
