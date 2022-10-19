defmodule Vtm.Creation do
  @moduledoc false

  import Ecto.Query, warn: false

  import Vtm.Helpers

  alias Vtm.Repo

  alias Vtm.Characters
  alias Vtm.Characters.Character
  alias Vtm.Characters.Attribute
  alias Vtm.Characters.AttributeType
  alias Vtm.Creation.Template
  alias Vtm.Creation.TemplateAttribute
  alias Vtm.Characters.CharacterAttribute

  def get_templates() do
    Template
    |> Repo.all()
  end

  defp invalid_changeset(%Ecto.Changeset{valid?: false}), do: true
  defp invalid_changeset(_), do: false

  defp insertion_error({:error, _}), do: true
  defp insertion_error(_), do: false

  defp delete_all_attributes(character_id) do
    from(ca in CharacterAttribute, where: ca.character_id == ^character_id)
    |> Repo.delete_all()
  end

  defp delete_attributes(character_id, type) do
    query =
      from ca in CharacterAttribute,
        join: a in Attribute,
        on: ca.attribute_id == a.id,
        join: t in AttributeType,
        on: a.attribute_type_id == t.id,
        where: ca.character_id == ^character_id,
        where: t.name == ^type

    Repo.delete_all(query)
  end

  defp append_attributes_transaction(values) do
    results =
      values
      |> Enum.map(&Repo.insert_or_update/1)

    case results |> Enum.any?(&insertion_error/1) do
      false ->
        %{}
      _     ->
        [error] =
          results
          |> Enum.filter(&insertion_error/1)
          |> Enum.take(1)

        Repo.rollback(error)
    end
  end

  @spec append_attributes(integer, list(map), number) :: any
  def append_attributes(character_id, attrs, new_stage) do
    # Cleaning
    case new_stage do
      2 -> delete_attributes(character_id, "Attribute")
      3 -> delete_attributes(character_id, "Ability")
      _ -> %{}
    end

    values = attrs |> Enum.map(&CharacterAttribute.changeset(%CharacterAttribute{}, &1))

    case values |> Enum.any?(&invalid_changeset/1) do
      false ->
        Repo.transaction(fn -> append_attributes_transaction(values) end)
      true  ->
        values
        |> Enum.filter(&invalid_changeset/1)
        |> Enum.take(1)
    end
  end

  defp param_to_id(id) when is_binary(id), do: String.to_integer(id)
  defp param_to_id(id), do: id

  defp switch_attribute_value(id_1, id_2, character_attributes) do
    {first = %{value: value_1}, second = %{value: value_2}} = {
      character_attributes |> Enum.find(fn
        %{attribute_id: ^id_1}  -> true
        _                       -> false
      end),
      character_attributes |> Enum.find(fn
        %{attribute_id: ^id_2}  -> true
        _                       -> false
      end)
    }

    [
      {first,  %{value: value_2}},
      {second, %{value: value_1}}
    ]
    |> Enum.map(fn {c, attrs} ->
      c
      |> CharacterAttribute.changeset(attrs)
      |> Repo.update()
    end)
    |> Enum.reduce({:ok, %{}}, fn
      _, acc = {:error, } -> acc
      a, _                -> a
    end)
  end

  defp change_character_attribute(character_attribute, to_id) do
    character_attribute
    |> CharacterAttribute.changeset(%{attribute_id: to_id})
    |> Repo.update()
  end

  def switch_attributes(%{character_id: id, first_attribute: first_id, second_attribute: second_id}) do
    {id_1, id_2} = {
      first_id |> param_to_id(),
      second_id |> param_to_id()
    }

    query =
      from ca in CharacterAttribute,
        where: ca.character_id == ^id,
        where: ca.attribute_id in [^id_1, ^id_2]

    case Repo.all(query) do
      [c = %{attribute_id: ^id_1}]  -> change_character_attribute(c, id_2)
      [c = %{attribute_id: ^id_2}]  -> change_character_attribute(c, id_1)
      attributes                    -> switch_attribute_value(id_1, id_2, attributes)
    end
  end

  # def switch_attributes(request) do
  #   IO.inspect {:error, request}
  # end
  def update_character_stage_non_vampires(user_id, new_stage, character_id, attrs) do
    case {
      Characters.character_of_user?(user_id, character_id),
      Characters.character_at_stage?(character_id, new_stage - 1),
      Characters.character_at_stage?(character_id, new_stage)
    } do
      {false, _, _} ->
        {:error, :illegal_access}
      {_, _, true} ->
        Characters.update_character(character_id, attrs)
      {_, true, _} ->
        Characters.update_character(character_id, attrs |> Map.put(:stage, new_stage))
    end
  end

  @spec update_character_stage(integer, number, list(map)) :: {:ok, %{id: integer}} | {:error, :illegal_access} | {:error, any}
  def update_character_stage(user_id, new_stage, attrs) do
    [%{character_id: character_id} | _] = attrs

    case {
      Characters.character_of_user?(user_id, character_id),
      Characters.character_at_stage?(character_id, new_stage - 1),
      Characters.character_at_stage?(character_id, new_stage)
    } do
      {false, _, _} ->
        {:error, :illegal_access}
      {_, _, true} ->
        with {:ok, _} <- append_attributes(character_id, attrs, new_stage) do
          {:ok, %{id: character_id}}
        end
      {_, true, _} ->
        with {:ok, _} <- append_attributes(character_id, attrs, new_stage) do
          Characters.update_character(character_id, %{stage: new_stage})
        end
    end
  end

  @spec create_attribute_value_from_template(struct(), non_neg_integer()) :: struct()
  defp create_attribute_value_from_template(%{attribute_id: a_id, value: v}, character_id) do
    with now <- NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second) do
      %{
        character_id: character_id,
        attribute_id: a_id,
        value: v,
        inserted_at: now,
        updated_at: now
      }
    end
  end

  defp insert_template_attributes_to_character(character_id, template_id) do
    css =
      from(ta in TemplateAttribute,
        where: ta.template_id == ^template_id)
      |> Repo.all()
      |> Enum.map(&create_attribute_value_from_template(&1, character_id))
      |> IO.inspect()

    case Repo.insert_all(CharacterAttribute, css) do
      {24, nil} -> :ok
      _         -> {:error, "Not all the attributes were inserted."}
    end
  end

  @spec set_ability_stage(integer) :: {:ok, Character.t()} | {:error, :not_found}
  defp set_ability_stage(character_id) do
    case Character |> Repo.get(character_id) do
      character when not is_nil(character) ->
        character
        |> Character.changeset(%{stage: 3})
        |> Repo.update()
      _ ->
        {:error, :not_found}
    end
  end

  @doc """
  Applies the template to the character, moving its stage to 3, the one after setting all the skills.
  """
  @spec apply_template_to_character(integer, integer) :: {:ok, Character.t()} | {:error, binary()} | {:error, :not_found}
  def apply_template_to_character(character_id, template_id) do
    delete_all_attributes(character_id)
    insert_template_attributes_to_character(character_id, template_id)
    set_ability_stage(character_id)
  end

  defp add_advantages_common(user_id, attrs = %{id: id}, apply_changeset) do
    query =
      from c in Character,
        where: c.id == ^id,
        where: c.user_id == ^user_id

    Repo.one(query)
    |> apply_changeset.(attrs)
    |> Repo.update()
  end

  def add_advantages(user_id, attrs) do
    add_advantages_common(user_id, attrs, &Character.add_advantages_character_changeset/2)
  end

  def add_human_advantages(user_id, attrs) do
    add_advantages_common(user_id, attrs, &Character.add_human_advantages_character_changeset/2)
  end

  defp get_complete_character_attrs(%{id: id}) do
    attributes =
      Characters.get_character_attributes(id)
      |> Map.new(fn
        %{attribute: %{name: name}, value: value} -> {name, value}
      end)

    {stamina, composure, resolve} = {
      attributes["Costituzione"],
      attributes["Autocontrollo"],
      attributes["Fermezza"]
    }

    {willpower, health, hunger} = {
      composure + resolve,
      stamina + 3,
      1
    }

    %{
      is_complete: true,
      willpower: willpower,
      health: health,
      hunger: hunger
    }
  end

  def complete_character(user_id, character_id) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        where: c.user_id == ^user_id

    case Repo.one(query) do
      nil ->
        {:error, :not_found}
      character ->
        attrs =
          character
          |> get_complete_character_attrs()

        character
        |> Character.finalize_character_changeset(attrs)
        |> Repo.update()
    end
  end

end
