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

pay = 15

masks = [
  "GuardianoNotturno",
  "Musicista",
  "Netturbino",
  "Programmatore",
  "CommessodiMinimarket",
  "DetectivePrivato",
  "Barista",
  "Tassista",
  "Fattorino",
  "Modello/a",
  "Taccheggiatore",
  "Professionistadelsesso",
  "Senzatetto",
  "Scultore",
  "Pittore",
  "AgentediRecuperoCrediti",
  "Influencer",
  "Fotografo",
]

for name <- masks do
  Vtm.SeedsOccupationsHelpers.insert_or_update_occupation(%{
    name: name,
    description: name,
    level1_name: name,
    level1_salary: pay
  })
end

corporations = [
  "Forze dell'Ordine",
  "Mass Media",
  "Sanità",
  "Alta Finanza",
  "Politica",
  "Criminalità",
  "Cultura",
]

for name <- corporations do
  Vtm.SeedsOccupationsHelpers.insert_or_update_occupation(%{
    name: name,
    description: name,
    level1_name: "Associato di primo livello",
    level1_salary: 10,
    level2_name: "Associato di secondo livello",
    level2_salary: 15,
    level3_name: "Associato di terzo livello",
    level3_salary: 20,
    level4_name: "Associato di quarto livello",
    level4_salary: 30,
    level5_name: "Associato di quinto livello",
    level5_salary: 50,
    level6_name: "Associato di sesto livello",
    level6_salary: 80
  })
end