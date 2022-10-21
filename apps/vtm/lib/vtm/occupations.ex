defmodule Vtm.Occupations do
  @moduledoc """
  The Occupations context.
  """

  import Ecto.Query, warn: false
  alias Vtm.Repo

  alias Vtm.Occupations.Occupation
  alias Vtm.Occupations.CharacterOccupation
  alias Vtm.Transactions
  alias VtmAuth.Accounts.User

  @occupation_refresh_interval 60 * 60 * 24 * -1

  @doc """
  Returns the list of occupations.

  ## Examples

      iex> list_occupations()
      [%Occupation{}, ...]

  """
  def list_occupations do
    Repo.all(Occupation)
  end

  @doc """
  Gets a single occupation.

  Raises `Ecto.NoResultsError` if the Occupation does not exist.

  ## Examples

      iex> get_occupation!(123)
      %Occupation{}

      iex> get_occupation!(456)
      ** (Ecto.NoResultsError)

  """
  def get_occupation!(id), do: Repo.get!(Occupation, id)

  @spec get_occupation(id :: non_neg_integer()) :: Occupation.t() | nil
  def get_occupation(id), do: Repo.get(Occupation, id)

  @doc """
  Creates a occupation.

  ## Examples

      iex> create_occupation(%{field: value})
      {:ok, %Occupation{}}

      iex> create_occupation(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_occupation(attrs \\ %{}) do
    %Occupation{}
    |> Occupation.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a occupation.

  ## Examples

      iex> update_occupation(occupation, %{field: new_value})
      {:ok, %Occupation{}}

      iex> update_occupation(occupation, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_occupation(%Occupation{} = occupation, attrs) do
    occupation
    |> Occupation.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a occupation.

  ## Examples

      iex> delete_occupation(occupation)
      {:ok, %Occupation{}}

      iex> delete_occupation(occupation)
      {:error, %Ecto.Changeset{}}

  """
  def delete_occupation(%Occupation{} = occupation) do
    Repo.delete(occupation)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking occupation changes.

  ## Examples

      iex> change_occupation(occupation)
      %Ecto.Changeset{data: %Occupation{}}

  """
  def change_occupation(%Occupation{} = occupation, attrs \\ %{}) do
    Occupation.changeset(occupation, attrs)
  end

  @spec get_character_occupation(non_neg_integer()) :: CharacterOccupation.t()
  def get_character_occupation(character_id) do
    CharacterOccupation
    |> from()
    |> where([co], co.character_id == ^character_id)
    |> preload(:occupation)
    |> Repo.one()
  end

  @spec character_can_request_salary?(non_neg_integer()) :: 
    {:ok, boolean()} |
    {:error, :not_found}
  def character_can_request_salary?(character_id) do
    case get_character_occupation(character_id) do
      nil ->
        {:error, :not_found}

      %{last_checked: last_checked} ->
        limit = NaiveDateTime.add(last_checked, @occupation_refresh_interval)
        {:ok, last_checked <= limit}
    end
  end

  @spec change_character_occupation(
    character_id :: non_neg_integer(),
    occupation_id :: non_neg_integer(),
    level :: non_neg_integer()
  ) :: 
    {:ok, CharacterOccupation.t()} | 
    {:error, Ecto.Changeset.t()} |
    {:error, :invalid_occupation}
  def change_character_occupation(character_id, occupation_id, level) do
    case get_character_occupation(character_id) do
      nil ->
        %CharacterOccupation{}
        |> CharacterOccupation.changeset(%{
          character_id: character_id,
          occupation_id: occupation_id,
          level: level,
          last_checked: DateTime.utc_now()
        })
        |> Repo.insert()

      occupation = %{occupation: %{id: id}} when occupation_id == id ->
        occupation
        |> CharacterOccupation.changeset(%{
          character_id: character_id,
          occupation_id: occupation_id,
          level: level,
          last_checked: NaiveDateTime.utc_now()
        })
        |> Repo.update()

      _ ->
        {:error, :invalid_occupation}
    end
  end

  @spec refresh_character_occupation_salary(
    character_id :: non_neg_integer(),
    user :: User.t()
  ) :: {:ok, CharacterOccupation.t()} | {:error, :invalid_occupation}
  def refresh_character_occupation_salary(character_id, user) do
    case get_character_occupation(character_id) do
      nil ->
        {:error, :no_occupation}

      %{last_checked: last_checked} = occupation ->
        if last_checked < NaiveDateTime.add(NaiveDateTime.utc_now(), @occupation_refresh_interval) do
          perform_character_occupation_salary_update(character_id, occupation, user)
        else
          {:error, :refresh_too_soon}
        end
    end
  end

  defp perform_character_occupation_salary_update(character_id, occupation, user) do
    with {:ok, %{occupation: %{salary: salary}}} <- update_character_occupation(occupation) do
      Transactions.increase_character_money(character_id, salary, user, "Stipendio")
    end
  end

  defp update_character_occupation(occupation) do
    occupation
    |> CharacterOccupation.changeset(%{
      last_checked: DateTime.utc_now()
    })
    |> Repo.update()
  end
end
