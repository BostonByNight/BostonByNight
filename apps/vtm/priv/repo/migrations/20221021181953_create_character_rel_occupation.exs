defmodule Vtm.Repo.Migrations.CreateCharacterRelOccupation do
  use Ecto.Migration

  def change do
    create table(:character_rel_occupation) do
      add :character_id, references(:characters, on_delete: :nothing)
      add :occupation_id, references(:occupations, on_delete: :nothing)
      add :level, :integer, null: false, default: 1
      add :last_checked, :naive_datetime

      timestamps()
    end

    create index(:character_rel_occupation, [:character_id])
    create index(:character_rel_occupation, [:occupation_id])

    create(
      unique_index(:character_rel_occupation, [:character_id], name: :character_occupation_unique_key)
    )
  end
end
