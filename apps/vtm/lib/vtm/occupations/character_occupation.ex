defmodule Vtm.Occupations.CharacterOccupation do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset

  @type t() :: %__MODULE__{
    id: integer(),

    character_id: integer(),
    occupation_id: integer(),
    level: integer(),
    last_checked: NaiveDateTime.t(),

    inserted_at: NaiveDateTime.t(),
    updated_at: NaiveDateTime.t()
  }

  schema "character_rel_occupation" do
    field :last_checked, :naive_datetime
    field :level, :integer

    belongs_to :character, Vtm.Characters.Character
    belongs_to :occupation, Vtm.Occupations.Occupation

    timestamps()
  end

  @doc false
  def changeset(character_occupation, attrs) do
    character_occupation
    |> cast(attrs, [:character_id, :occupation_id, :last_checked])
    |> foreign_key_constraint(:character_id)
    |> foreign_key_constraint(:occupation_id)
    |> validate_required([:last_checked])
  end
end
