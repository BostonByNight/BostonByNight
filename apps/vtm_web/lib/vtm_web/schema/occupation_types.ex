defmodule VtmWeb.Schema.OccupationTypes do
  @moduledoc false
  
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias VtmWeb.Resolvers.OccupationResolvers

  node object :occupation do
    field :name, non_null(:string)
    field :description, :string
    field :level1_name, non_null(:string)
    field :level1_salary, non_null(:integer)
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
  end

  node object :character_occupation do
    field :character_id, non_null(:id)
    field :occupation_id, non_null(:id)
    field :occupation, :occupation
    field :last_checked, :date_time
    field :level, :integer
  end

  object :refresh_occupation_salary_result do
    field :type, non_null(:string)
    field :message, non_null(:string)
  end

  object :occupation_queries do
    field :get_occupations, list_of(:occupation) do
      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &OccupationResolvers.get_all_occupations/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_occupation, :occupation do
      arg :occupation_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&OccupationResolvers.get_occupation_by_id/2, occupation_id: :occupation)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :can_character_request_salary, :boolean do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&OccupationResolvers.character_can_request_salary?/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_occupation, :character_occupation do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&OccupationResolvers.get_character_occupation/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end
  end

  object :occupation_mutations do
    payload field :change_character_occupation do
      input do
        field :character_id, non_null(:id)
        field :occupation_id, non_null(:id)
        field :level, non_null(:integer)
      end

      output do
        field :result, :occupation
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&OccupationResolvers.change_character_occupation/2,
        character_id: :character, 
        occupation_id: :occupation)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :refresh_character_occupation_salary do
      input do
        field :character_id, non_null(:id)
      end

      output do
        field :result, :refresh_occupation_salary_result
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&OccupationResolvers.refresh_character_occupation_salary/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :reset_occupation_timer do
      input do
        field :character_id, non_null(:id)
      end

      output do
        field :result, :character_occupation
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&OccupationResolvers.reset_occupation_timer/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end
  end
end
