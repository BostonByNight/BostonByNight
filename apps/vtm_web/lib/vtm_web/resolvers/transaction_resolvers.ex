defmodule VtmWeb.Resolvers.TransactionResolvers do
  @moduledoc false
  
  import VtmWeb.Resolvers.Helpers

  alias Vtm.Transactions
  alias Vtm.Characters
  alias VtmAuth.Accounts
  alias Vtm.Characters.Transaction

  def all(_, _, _) do
    {:ok, 
      Transactions.all()
      |> Enum.map(&transaction_mapper/1)
    }
  end

  def get_character_transactions(%{character_id: character_id}, %{context: %{current_user: %{id: user_id}}}) do
    if Characters.character_of_user?(user_id, character_id) || Accounts.is_user_master?(user_id) do
      {:ok, 
        Transactions.get_character_transactions(character_id)
        |> Enum.map(&transaction_mapper/1)
      }
    else
      {:error, :unauthorized}
    end
  end

  def get_transaction(%{transaction_id: transaction_id}, %{context: %{current_user: %{id: user_id}}}) do
    with {:ok, transaction = %{
        character_id: c_id
      }} <- Transactions.get_transaction_by_id(transaction_id) do

      if Characters.character_of_user?(user_id, c_id) || Accounts.is_user_master?(user_id) do
        {:ok, 
          transaction
          |> transaction_mapper()
        }
      else
        {:error, :unauthorized}
      end
    end
  end

  def perform_transaction(%{
    character_id: character_id,
    to_character_id: to_character_id,
    amount: amount,
    reason: reason
  }, %{context: %{current_user: %{id: user_id}}}) do
    if Characters.character_of_user?(user_id, character_id) do
      with {:ok, c_id}      <- parsed_id_to_integer?(character_id),
           {:ok, tc_id}     <- parsed_id_to_integer?(to_character_id) do
        Transactions.perform_transaction(
          c_id,
          tc_id,
          amount,
          reason
        )
      end
    else
      {:error, :unauthorized}
    end
  end

  def update_character_money(%{character_id: character_id, money: money}, %{context: %{current_user: user}}) do
    with {:ok, c_id}      <- character_id |> parsed_id_to_integer?(),
         {:ok, character} <- Transactions.update_character_money(c_id, money, user) do
      {:ok, %{result: character}}
    end
  end

  @spec transaction_mapper(transaction :: Transaction.t()) :: map()
  defp transaction_mapper(transaction = %{
    character: %{name: c_name},
    to_character: %{name: tc_name}
  }) when not is_nil(c_name) do
    transaction
    |> Map.put(:character_name, c_name)
    |> Map.put(:to_character_name, tc_name)
    |> Map.put(:transaction_time, transaction.inserted_at)
  end

  defp transaction_mapper(transaction) do
    transaction
    |> Map.put(:transaction_time, transaction.inserted_at)
  end
end
