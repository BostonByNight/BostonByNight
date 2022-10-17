defmodule Vtm.Transactions do
  @moduledoc false

  import Ecto.Query, warn: false
  alias Ecto.Changeset
  alias Vtm.Repo

  alias Vtm.Characters
  alias Vtm.Characters.Transaction
  alias Vtm.Characters.Character

  @all_transactions_limit 60 * 60 * 24 * -1
  
  @doc """
  Gets all the last transactions performed in the land.
  """
  @spec all() :: list(Transaction.t())
  def all() do
    limit = 
      NaiveDateTime.utc_now()
      |> NaiveDateTime.add(@all_transactions_limit)

    Transaction
    |> from()
    |> where([t], t.inserted_at > ^limit)
    |> Repo.all()
  end

  @spec get_character_transactions(character_id :: non_neg_integer()) :: list(Transaction.t())
  def get_character_transactions(character_id) do
    Transaction
    |> from()
    |> where([t], t.character_id == ^character_id)
    |> or_where([t], t.to_character_id == ^character_id)
    |> Repo.all()
  end

  @spec get_transaction_by_id(transaction_id :: non_neg_integer()) ::
    {:ok, Transaction.t()} |
    {:error, :not_found}
  def get_transaction_by_id(transaction_id) do
    case Repo.get(Transaction, transaction_id) do
      nil ->
        {:error, :not_found}

      t ->
        {:ok, t}
    end
  end

  @spec insert_transaction(attrs :: Map.t()) ::
    {:ok, Transaction.t()} |
    {:error, Changeset.t()}
  def insert_transaction(attrs) do
    %Transaction{}
    |> Transaction.changeset(attrs)
    |> Repo.insert()
  end

  @spec update_character_money(
    character_id :: non_neg_integer(), 
    money :: integer(), 
    user :: User.t()) :: 
      {:ok, Transaction.t()} | 
      {:error, binary()}
  def update_character_money(character_id, money, user = %{id: user_id}) do
    attrs = fn id, amount -> %{
      character_id: id,
      amount: amount,
      reason: "Transazione del Narratore",
      master_user_id: user_id
    } end

    case Characters.get_specific_character(user, character_id) do
      nil ->
        {:error, :not_found}
      %{id: id} ->
        with {:ok, %{money: current_money}} <- Characters.update_character(id, %{money: money}),
             transaction_amount             <- (money - current_money),
             {:ok, transaction}             <- insert_transaction(attrs.(id, transaction_amount)) do
          {:ok, transaction}
        end
    end
  end
end
