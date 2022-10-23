defmodule Vtm.Repo.Migrations.CreateOccupations do
  use Ecto.Migration

  def change do
    create table(:occupations) do
      add :name, :string, null: false
      add :description, :text
      add :level1_name, :string, null: false
      add :level1_salary, :integer, null: false, default: 0
      add :level2_name, :string
      add :level2_salary, :integer, default: 0
      add :level3_name, :string
      add :level3_salary, :integer, default: 0
      add :level4_name, :string
      add :level4_salary, :integer, default: 0
      add :level5_name, :string
      add :level5_salary, :integer, default: 0
      add :level6_name, :string
      add :level6_salary, :integer, default: 0

      timestamps()
    end
  end
end
