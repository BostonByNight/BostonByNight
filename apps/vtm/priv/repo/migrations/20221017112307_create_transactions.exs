defmodule Vtm.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    create table(:transactions) do
      add :amount, :integer, default: 0, null: false
      add :reason, :text
      add :character_id, references(:characters, on_delete: :nothing), null: false
      add :to_character_id, references(:characters, on_delete: :nothing)

      timestamps()
    end

    create index(:transactions, [:character_id])
    create index(:transactions, [:to_character_id])
  end
end
