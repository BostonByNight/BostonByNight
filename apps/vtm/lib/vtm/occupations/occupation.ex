defmodule Vtm.Occupations.Occupation do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset

  @type t() :: %__MODULE__{
    id: integer(),

    name: binary(),
    description: binary(),

    level1_name: binary(),
    level1_salary: integer(),
    level2_name: binary(),
    level2_salary: integer(),
    level3_name: binary(),
    level3_salary: integer(),
    level4_name: binary(),
    level4_salary: integer(),
    level5_name: binary(),
    level5_salary: integer(),
    level6_name: binary(),
    level6_salary: integer(),

    inserted_at: NaiveDateTime.t(),
    updated_at: NaiveDateTime.t()
  }

  schema "occupations" do
    field :name, :string
    field :description, :string
    field :level1_name, :string
    field :level1_salary, :integer
    field :level2_name, :string
    field :level2_salary, :integer
    field :level3_name, :string
    field :level3_salary, :integer
    field :level4_name, :string
    field :level4_salary, :integer
    field :level5_name, :string
    field :level5_salary, :integer
    field :level6_name, :string
    field :level6_salary, :integer

    timestamps()
  end

  @doc false
  def changeset(occupation, attrs) do
    occupation
    |> cast(attrs, [:name, :description, :level1_name, :level1_salary, :level2_name, :level2_salary, :level3_name, :level3_salary, :level4_name, :level4_salary, :level5_name, :level5_salary, :level6_name, :level6_salary])
    |> validate_required([:name, :level1_name, :level1_salary])
  end
end
