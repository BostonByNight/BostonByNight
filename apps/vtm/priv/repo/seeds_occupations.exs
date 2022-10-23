defmodule Vtm.SeedsOccupationsHelpers do
  @moduledoc """
  Helpers for corporation insertion.
  """

  alias Vtm.Occupations
  alias Vtm.Occupations.Occupation

  @spec insert_or_update_occupation(occupation: Occupation.t()) :: 
    {:ok, Occupation.t()} | 
    {:error, Ecto.Changeset.t()}
  def insert_or_update_occupation(occupation = %{name: occupation_name}) do
    case Occupations.get_occupation_by_name(occupation_name) do
      nil ->
        Occupations.create_occupation(occupation)

      existing_occupation ->
        Occupations.update_occupation(existing_occupation, occupation)
    end
  end
end

Vtm.SeedsOccupationsHelpers.insert_or_update_occupation(%{
  name: "Accountant",
  description: "An accountant",
  level1_name: "Accountant",
  level1_salary: 10
})

Vtm.SeedsOccupationsHelpers.insert_or_update_occupation(%{
  name: "Banker",
  description: "A banker",
  level1_name: "Intern",
  level1_salary: 10,
  level2_name: "Junior Accountant",
  level2_salary: 30,
  level3_name: "Senior Accountant",
  level3_salary: 60,
  level4_name: "Principal Accountant",
  level4_salary: 100,
  level5_name: "Leader",
  level5_salary: 200,
  level6_name: "CEO",
  level6_salary: 1000
})
