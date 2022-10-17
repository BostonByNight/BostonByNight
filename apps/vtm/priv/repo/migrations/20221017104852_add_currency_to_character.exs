defmodule :"Elixir.Vtm.Repo.Migrations.Add-currency-to-character" do
  use Ecto.Migration

  def change do
    alter table(:characters) do
      add :money, :integer, default: 0
    end
  end
end
