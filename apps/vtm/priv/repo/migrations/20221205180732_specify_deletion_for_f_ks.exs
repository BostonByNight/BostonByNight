defmodule Vtm.Repo.Migrations.SpecifyDeletionFor_FKs do
  use Ecto.Migration

  def change do
    drop constraint("transactions", "transactions_character_id_fkey")
    drop constraint("transactions", "transactions_to_character_id_fkey")
    drop constraint("transactions", "transactions_master_user_id_fkey")
    drop constraint("character_rel_occupation", "character_rel_occupation_character_id_fkey")
    drop constraint("character_rel_occupation", "character_rel_occupation_occupation_id_fkey")
  
    alter table(:transactions) do
      modify :character_id, references(:characters, on_delete: :delete_all), null: false
      modify :to_character_id, references(:characters, on_delete: :delete_all)
      modify :master_user_id, references(:users, on_delete: :delete_all)
    end

    alter table(:character_rel_occupation) do
      modify :character_id, references(:characters, on_delete: :delete_all)
      modify :occupation_id, references(:occupations, on_delete: :delete_all)
    end
  end
end
