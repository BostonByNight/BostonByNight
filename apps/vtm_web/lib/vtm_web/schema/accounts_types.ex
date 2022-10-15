defmodule VtmWeb.Schema.AccountTypes do
  @moduledoc false

  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias VtmWeb.Schema.Middlewares
  alias VtmWeb.Resolvers.AccountsResolvers
  alias VtmWeb.Resolvers.CharacterResolvers
  alias VtmWeb.Resolvers.MessageResolvers

  node object :user do
    field :original_id, :id
    field :email, :string
    field :name, :string
    field :role, :role
    field :session_character, :character

    field :user_characters, list_of(:character) do
      middleware Middlewares.Authorize, :any
      resolve &CharacterResolvers.get_user_characters/3
      middleware Middlewares.ChangesetErrors
    end

    field :user_session_character, :character do
      middleware Middlewares.Authorize, :any
      resolve &CharacterResolvers.get_session_character/3
      middleware Middlewares.ChangesetErrors
    end

    field :received_messages, list_of(:message) do
      middleware Middlewares.Authorize, :any
      resolve &MessageResolvers.received_messages/3
      middleware Middlewares.ChangesetErrors
    end

    field :sent_messages, list_of(:message) do
      middleware Middlewares.Authorize, :any
      resolve &MessageResolvers.sent_messages/3
      middleware Middlewares.ChangesetErrors
    end
  end

  object :login_response do
    field :token, :string
    field :relogin_token, :string
    field :user, :user
    field :character, :character
  end

  object :session do
    field :user, :user
    field :character, :character
    field :location, :chat_location
    field :visible, :boolean
  end

  enum :role do
    value :user, as: "player"
    value :master, as: "master"
  end

  object :creation_result do
    field :id, :id
  end

  object :user_queries do
    field :all_users, list_of(:user) do
      description "Get all the users"

      middleware Middlewares.Authorize, :player
      resolve &AccountsResolvers.all/3
      middleware Middlewares.ChangesetErrors
    end

    field :user_online_visible, :boolean do
      middleware Middlewares.Authorize, :master
      resolve &AccountsResolvers.user_online_visible/3
      middleware Middlewares.ChangesetErrors
    end

    field :user_name_exists, :boolean do
      arg :name, non_null(:string)
      resolve &AccountsResolvers.user_name_exists?/3
    end

    field :user_email_exists, :boolean do
      arg :email, non_null(:string)
      resolve &AccountsResolvers.user_email_exists?/3
    end

    field :sessions_list, list_of(:session) do
      middleware Middlewares.Authorize, :player
      resolve &AccountsResolvers.all_sessions/3
      middleware Middlewares.ChangesetErrors
    end

    field :subscription_token, :string do
      middleware Middlewares.Authorize, :player
      resolve &AccountsResolvers.token/3
      middleware Middlewares.ChangesetErrors
    end
  end

  object :user_mutations do
    field :create_user, :creation_result do
      arg :email, non_null(:string)
      arg :name, non_null(:string)

      resolve &AccountsResolvers.create/3
    end

    field :update_user_password, :boolean do
      arg :old_password, non_null(:string)
      arg :new_password, non_null(:string)
      arg :repeat_password, non_null(:string)

      middleware Middlewares.Authorize, :any
      resolve &AccountsResolvers.update_user_password/3
      middleware Middlewares.ChangesetErrors
    end

    field :request_new_password, :boolean do
      arg :user_email, non_null(:string)

      resolve &AccountsResolvers.request_new_password/3
    end

    field :login, :login_response do
      arg :email, non_null(:string)
      arg :password, non_null(:string)
      arg :remember, non_null(:boolean)

      resolve &AccountsResolvers.login/3

      middleware Middlewares.Login, :any
      middleware Middlewares.ChangesetErrors
    end

    field :update_session_character, :character do
      arg :character_id, :id

      middleware Middlewares.Authorize, :any
      resolve parsing_node_ids(&AccountsResolvers.update_session_character/2, character_id: :character)
      middleware Middlewares.ChangesetErrors
    end

    field :update_session_map, :id do
      arg :map_id, :id

      middleware Middlewares.Authorize, :any
      middleware VtmWeb.Schema.Middlewares.RefreshUserSession
      resolve parsing_node_ids(&AccountsResolvers.update_session_map/2, map_id: :chat_location)
      middleware Middlewares.ChangesetErrors
    end

    field :toggle_session_visible, :boolean do
      middleware Middlewares.Authorize, :master
      middleware VtmWeb.Schema.Middlewares.RefreshUserSession
      resolve &AccountsResolvers.toggle_session_visible/3
      middleware Middlewares.ChangesetErrors
    end

    field :reset_session_map, :boolean do
      middleware Middlewares.Authorize, :any
      middleware VtmWeb.Schema.Middlewares.RefreshUserSession
      resolve &AccountsResolvers.reset_session_map/3
      middleware Middlewares.ChangesetErrors
    end

    field :reset_session, :boolean do
      middleware Middlewares.Authorize, :any
      resolve &AccountsResolvers.clear_session/3
      middleware Middlewares.ChangesetErrors
    end

    field :logout, :boolean do
      middleware Middlewares.Authorize, :any
      resolve &AccountsResolvers.logout/3
      middleware Middlewares.ChangesetErrors
    end
  end
end
