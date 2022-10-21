defmodule VtmWeb.Resolvers.OccupationResolvers do
  @moduledoc false

  alias Vtm.Occupations
  alias Vtm.Characters
  alias VtmAuth.Accounts

  def get_all_occupations(_, _, _) do
    {:ok, Occupations.list_occupations()}
  end

  def get_occupation_by_id(%{occupation_id: occupation_id}, _) do
    case Occupations.get_occupation(occupation_id) do
      nil -> {:error, :not_found}
      occupation -> {:ok, occupation}
    end
  end

  def get_character_occupation(%{character_id: character_id}, %{context: %{current_user: %{id: user_id}}}) do
    if character_of_user_or_master?(user_id, character_id) do
      case Occupations.get_character_occupation(character_id) do
        nil -> {:error, :not_found}
        character_occupation -> {:ok, character_occupation}
      end
    else
      {:error, :unauthorized}
    end
  end

  def character_can_request_salary?(%{character_id: character_id}, %{context: %{current_user: %{id: user_id}}}) do
    if character_of_user_or_master?(user_id, character_id) do
      case Occupations.character_can_request_salary?(character_id) do
        nil -> {:error, :not_found}
        result -> {:ok, result}
      end
    else
      {:error, :unauthorized}
    end
  end

  def change_character_occupation(%{
    character_id: character_id,
    occupation_id: occupation_id,
    level: level
  }, _) do
    Occupations.change_character_occupation(character_id, occupation_id, level)
  end

  def refresh_character_occupation_salary(%{character_id: character_id}, %{context: %{current_user: user}}) do
    Occupations.refresh_character_occupation_salary(character_id, user)
  end

  defp character_of_user_or_master?(character_id, user_id) do
    Accounts.is_user_master?(user_id) or Characters.character_of_user?(user_id, character_id)
  end
end
