defmodule VtmWeb.Schema.CharacterTypes do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias VtmWeb.Resolvers.CharacterResolvers

  node object :clan do
    field :name, :string
  end

  node object :predator_type do
    field :name, :string
    field :description, :string
  end

  node object :attribute_type do
    field :name, :string
    field :section, :string
  end

  node object :attribute do
    field :name, :string
    field :description, :string
    field :order, :integer
    field :attribute_type, :attribute_type
  end

  node object :discipline do
    field :name, :string
    field :description, :string
  end

  node object :character_avatar do
    field :avatar, :string
  end

  node object :character_chat_avatar do
    field :chat_avatar, :string
  end

  node object :character do
    field :user, :user
    field :name, :string
    field :biography, :string
    field :description, :string
    field :soundtrack, :string
    field :off, :string
    field :avatar, :string
    field :is_npc, :boolean
    field :is_complete, :boolean
    field :experience, :integer
    field :total_experience, :integer
    field :humanity, :integer
    field :generation, :integer
    field :stage, :integer
    field :approved, :boolean
    field :hunger, :integer
    field :health, :integer
    field :damage, :integer
    field :aggravated_damage, :integer
    field :willpower, :integer
    field :willpower_damage, :integer
    field :stains, :integer
    field :blood_potency, :integer
    field :torpor, :boolean
    field :dead, :boolean
    field :advantages, :string
    field :notes, :string
    field :discipline_powers, :string
    field :specialties, :string
    field :convictions, :string
    field :objects, :string
    field :clan, :clan
    field :predator_type, :predator_type
    field :last_resonance, :string
    field :last_hunt, :date_time
    field :hunt_difficulty, :integer
    field :is_awake, :boolean
    field :last_awake, :date_time
    field :last_resonance_intensity, :integer
    field :money, :integer
  end

  node object :character_attribute do
    field :attribute, :attribute
    field :value, :integer
  end

  object :character_stats do
    field :id, :id
    field :predator_type, :predator_type
    field :attributes, list_of(:character_attribute)
    field :disciplines, list_of(:character_attribute)
    field :advantages, list_of(:character_attribute)
  end

  node object :creation_template do
    field :name, :string
    field :description, :string
  end

  input_object :character_creation_request do
    field :name, non_null(:string)
    field :clan_id, non_null(:string)
    field :avatar, :string
    field :chat_avatar, :string
    field :biography, non_null(:string)
    field :description, non_null(:string)
    field :is_npc, :integer
  end

  input_object :character_attribute_request do
    field :character_id, non_null(:id)
    field :attribute_id, non_null(:id)
    field :value, non_null(:integer)
  end

  input_object :character_finalization_request do
    field :predator_type_id, :id
    field :discipline_powers, :string
    field :specialties, :string
    field :convictions, :string
    field :advantages, non_null(:string)
    field :notes, :string
  end

  input_object :change_sheet_info_request do
    field :avatar, :string
    field :chat_avatar, :string
    field :description, :string
    field :biography, :string
    field :objects, :string
    field :soundtrack, :string
    field :off, :string
  end

  object :character_avatar_response do
    field :character, :character
    field :avatar, :character_avatar
  end

  object :character_chat_avatar_response do
    field :character, :character
    field :chat_avatar, :character_chat_avatar
  end

  object :character_queries do
    field :characters_list, list_of(:character) do
      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.all/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :players_characters_list, list_of(:character) do
      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.all_players/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :unapproved_characters_list, list_of(:character) do
      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve &CharacterResolvers.all_unapproved/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :clans, list_of(:clan) do
      resolve &CharacterResolvers.get_clans/3
    end

    field :creation_clans, list_of(:clan) do
      resolve &CharacterResolvers.get_creation_clans/3
    end

    field :predator_types, list_of(:predator_type) do
      resolve &CharacterResolvers.get_predator_types/3
    end

    field :attributes, list_of(:attribute) do
      resolve &CharacterResolvers.get_attributes/3
    end

    field :clan_disciplines, list_of(:discipline) do
      arg :clan_id, non_null(:id)

      resolve parsing_node_ids(&CharacterResolvers.get_clan_disciplines/2, clan_id: :clan)
    end

    field :get_character, :character do
      arg :id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.get_character/2, id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_public_info, :character do
      arg :id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.get_character_public_info/2, id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_user, :user do
      arg :character_id, non_null(:id)

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      middleware VtmWeb.Schema.Middlewares.AuthorizeCharacterId, :any
      resolve parsing_node_ids(&CharacterResolvers.get_character_user/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_session_character, :character do
      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.get_session_character/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_avatar, :character_avatar do
      arg :character_id, non_null(:id)

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.get_character_avatar/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_characters_avatar, list_of(:character_avatar_response) do
      arg :character_ids, list_of(non_null(:id))

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.get_characters_avatar/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_chat_avatar, :character_chat_avatar do
      arg :character_id, non_null(:id)

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.get_character_chat_avatar/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_characters_chat_avatar, list_of(:character_chat_avatar_response) do
      arg :character_ids, list_of(non_null(:id))

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.get_characters_chat_avatar/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_stats, :character_stats do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.get_character_stats/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_creation_templates, list_of(:creation_template) do
      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.get_creation_templates/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :is_character_awake, :boolean do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.is_character_awake/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end
  end

  object :character_mutations do
    field :create_character, :character do
      arg :request, :character_creation_request

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.create_character/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :append_character_attributes, :character do
      arg :request, list_of(:character_attribute_request)
      arg :new_stage, non_null(:integer)

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.append_attributes/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :add_advantages do
      input do
        field :character_id, non_null(:id)
        field :request, non_null(:character_finalization_request)
        field :attributes, list_of(:character_attribute_request)
        field :new_stage, non_null(:integer)
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.add_advantages/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :apply_template_to_character do
      input do
        field :character_id, non_null(:id)
        field :template_id, non_null(:id)
      end

      output do
        field :result, :boolean
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.apply_template_to_character/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :switch_character_attributes, :character do
      arg :character_id, :id
      arg :first_attribute, :string
      arg :second_attribute, :string

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve &CharacterResolvers.switch_attributes/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :finalize_character, :character do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.finalize_character/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :delete_character, :boolean do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&CharacterResolvers.delete_character/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :approve_character, :boolean do
      arg :character_id, non_null(:id)
      arg :reason, :string

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.approve_character/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :reject_character, :boolean do
      arg :character_id, non_null(:id)
      arg :reason, non_null(:string)

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.reject_character/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_sheet_info do
      input do
        field :character_id, non_null(:id)
        field :request, non_null(:change_sheet_info_request)
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      middleware VtmWeb.Schema.Middlewares.AuthorizeCharacterId, :any
      resolve parsing_node_ids(&CharacterResolvers.change_sheet_info/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_character_attribute do
      input do
        field :character_id, non_null(:id)
        field :attribute_id, non_null(:id)
        field :new_value, non_null(:integer)
      end

      output do
        field :result, :boolean
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.change_character_attribute/2, character_id: :character, attribute_id: :attribute)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_character_other_stats do
      input do
        field :character_id, non_null(:id)
        field :predator_type_id, non_null(:id)
        field :humanity, non_null(:integer)
        field :willpower, non_null(:integer)
        field :blood_potency, non_null(:integer)
        field :health, non_null(:integer)
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.update_character/2, character_id: :character, predator_type_id: :predator_type)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_character_experience do
      input do
        field :character_id, non_null(:id)
        field :experience_change, non_null(:integer)
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.update_character_experience/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_character_hunt_difficulty do
      input do
        field :character_id, non_null(:id)
        field :hunt_difficulty, non_null(:integer)
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.update_character_hunt_difficulty/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :spend_character_experience do
      input do
        field :character_id, non_null(:id)
        field :attribute_id, :id
        field :custom_experience_expenditure, :integer
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.spend_character_experience/2, character_id: :character, attribute_id: :attribute)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_character_notes do
      input do
        field :character_id, non_null(:id)
        field :notes, non_null(:string)
        field :advantages, non_null(:string)
        field :discipline_powers, :string
        field :specialties, :string
        field :convictions, :string
        field :objects, :string
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.update_character/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :change_character_status do
      input do
        field :character_id, non_null(:id)
        field :notes, non_null(:string)
        field :advantages, non_null(:string)
        field :discipline_powers, :string
        field :specialties, :string
        field :convictions, :string
        field :objects, :string
      end

      output do
        field :result, :character
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&CharacterResolvers.update_character/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end
  end
end
