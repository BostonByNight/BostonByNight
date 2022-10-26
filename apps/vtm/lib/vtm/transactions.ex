defmodule Vtm.Transactions do
  @moduledoc false

  import Ecto.Query, warn: false
  alias Ecto.Changeset
  alias Vtm.Repo

  alias Vtm.Characters
  alias Vtm.Characters.Transaction

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
    |> preload(:character)
    |> preload(:to_character)
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

  @spec perform_transaction(
    character_id :: non_neg_integer(),
    to_character_id :: non_neg_integer(),
    amount :: non_neg_integer(),
    reason :: binary()
  ) ::
    {:ok, Transaction.t()} |
    {:error, Changeset.t()} |
    {:error, :not_found}
  def perform_transaction(
    character_id,
    to_character_id,
    amount,
    reason
  ) do
    with {:ok, character_money} <- Characters.get_character_money_by_id(character_id),
         {:ok, recipient_money} <- Characters.get_character_money_by_id(to_character_id),
         {:ok, _} <- Characters.update_character(character_id, %{money: character_money - amount}),
         {:ok, _} <- Characters.update_character(to_character_id, %{money: recipient_money + amount}),
         {:ok, transaction} <- insert_transaction(%{
           character_id: character_id,
           to_character_id: to_character_id,
           amount: amount,
           reason: reason
         }) do
      {:ok, transaction}
    else
      {:error, :not_found} ->
        {:error, :not_found}

      {:error, changeset} ->
        {:error, changeset}
    end
  end

  @spec increase_character_money(
    character_id :: non_neg_integer(), 
    money :: integer(), 
    user :: User.t(),
    reason :: binary() | nil) :: 
      {:ok, Transaction.t()} | 
      {:error, binary()}
  def increase_character_money(character_id, money, user = %{id: user_id}, reason \\ "Transazione del Narratore") do    
    case Characters.get_specific_character(user, character_id) do
      nil ->
        {:error, :not_found}
      character = %{money: current_money} ->
        update_character_money_internal(character, current_money + money, user_id, reason)
    end
  end

  @spec update_character_money(
    character_id :: non_neg_integer(), 
    money :: integer(), 
    user :: User.t(),
    reason :: binary() | nil) :: 
      {:ok, Transaction.t()} | 
      {:error, binary()}
  def update_character_money(character_id, money, user = %{id: user_id}, reason \\ "Transazione del Narratore") do
    case Characters.get_specific_character(user, character_id) do
      nil ->
        {:error, :not_found}
      character ->
        update_character_money_internal(character, money, user_id, reason)
    end
  end

  defp update_character_money_internal(
    %{id: id, money: current_money}, 
    money,
    master_user_id,
    reason
  ) when current_money >= money do
    with {:ok, _} <- Characters.update_character(id, %{money: money}) do
      transaction_amount = money - current_money

      attrs = %{
        character_id: id,
        amount: transaction_amount,
        reason: reason,
        master_user_id: master_user_id
      }

      insert_transaction(attrs)
    end
  end

  defp update_character_money_internal(_, _, _, _) do
    {:error, :not_enough_money}
  end
end
