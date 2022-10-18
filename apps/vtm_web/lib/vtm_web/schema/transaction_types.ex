defmodule VtmWeb.Schema.TransactionTypes do
  @moduledoc false
  
  use Absinthe.Schema.Notation
  use Absinthe.Relay.Schema.Notation, :modern

  alias VtmWeb.Resolvers.TransactionResolvers

  node object :transaction do
    field :character_id, non_null(:id)
    field :character_name, :string
    field :to_character_id, :id
    field :to_character_name, :string
    field :amount, :integer
    field :reason, :string
    field :transaction_time, :date_time
  end

  object :transaction_queries do
    field :get_latest_transactions, list_of(:transaction) do
      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve &TransactionResolvers.all/3
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_character_transactions, list_of(:transaction) do
      arg :character_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&TransactionResolvers.get_character_transactions/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    field :get_transaction, :transaction do
      arg :transaction_id, :id

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&TransactionResolvers.get_transaction/2, transaction_id: :transaction)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end
  end

  object :transaction_mutations do
    payload field :perform_transaction do
      input do
        field :character_id, non_null(:id)
        field :to_character_id, non_null(:id)
        field :amount, non_null(:integer)
        field :reason, :string
      end

      output do
        field :result, :transaction
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :any
      resolve parsing_node_ids(&TransactionResolvers.perform_transaction/2,
        character_id: :character, 
        to_character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end

    payload field :update_character_money do
      input do
        field :character_id, non_null(:id)
        field :money, non_null(:integer)
      end

      output do
        field :result, :transaction
      end

      middleware VtmWeb.Schema.Middlewares.Authorize, :master
      resolve parsing_node_ids(&TransactionResolvers.update_character_money/2, character_id: :character)
      middleware VtmWeb.Schema.Middlewares.ChangesetErrors
    end
  end
end
