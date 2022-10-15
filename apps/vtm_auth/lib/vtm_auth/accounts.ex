defmodule VtmAuth.Accounts do
  @moduledoc false

  import Ecto.Query, warn: false

  alias Comeonin.Ecto.Password

  alias VtmAuth.Repo
  alias VtmAuth.Accounts.User
  alias VtmAuth.Accounts.Session
  alias VtmAuth.Accounts.SessionInfo
  alias VtmAuth.Accounts.ResetPasswordRequest

  import VtmAuth.Helpers

  @session_offset 60

  def list_users() do
    User
    |> Repo.all()
  end

  @spec nil_to_result(any() | nil) :: {:ok, User.t()} | {:error, :not_found}
  defp nil_to_result(u) do
    case u do
      nil -> {:error, :not_found}
      u   -> {:ok, u}
    end
  end

  def get_all_users() do
    query =
      from u in User,
        select: {u.id, u.name}

    Repo.all(query)
    |> Enum.map(fn {id, name} -> %{id: id, name: name} end)
  end

  @spec get_user(integer()) :: {:error, :not_found} | {:ok, User.t()}
  def get_user(id), do:
    User
    |> Repo.get(id)
    |> nil_to_result()

  @spec get_user_by_email(binary()) :: {:error, :not_found} | {:ok, User.t()}
  def get_user_by_email(email) do
    User
    |> Repo.get_by(email: email)
    |> nil_to_result()
  end

  @spec get_not_banned_user_by_email(binary()) :: {:ok, User.t()} | {:error, :not_found}
  def get_not_banned_user_by_email(email) do
    User
    |> from()
    |> where([u], u.email == ^email)
    |> where([u], u.banned == false)
    |> Repo.one()
    |> nil_to_result()
  end

  @spec user_name_exists?(binary()) :: boolean()
  def user_name_exists?(name) do
    query = from u in User, where: u.name == ^name

    case Repo.one(query) do
      nil -> false
      _   -> true
    end
  end

  @spec user_email_exists?(binary()) :: boolean()
  def user_email_exists?(email) do
    query = from u in User, where: u.email == ^email

    case Repo.one(query) do
      nil -> false
      _   -> true
    end
  end

  @doc """
  Creates a new user. The user will not be able to set its password at the creation step,
  the password will be automatically generated and sent by email.
  """
  def create_user(attrs \\ %{}) do
    new_attrs =
      case attrs |> map_to_atom_map() do
        a = %{role: role} -> %{a | role: String.downcase(role)}
        _                 -> attrs
      end

    %User{}
    |> User.changeset(new_attrs)
    |> Repo.insert()
  end

  @spec update_user(User.t(), map()) :: {:ok, User.t()} | {:error, Ecto.Changeset.t()}
  def update_user(user = %User{}, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @spec get_last_session_by_user_query(non_neg_integer()) :: Ecto.Query.t()
  defp get_last_session_by_user_query(user_id) do
    from s in Session,
      where: s.user_id == ^user_id,
      where: not(s.completed)
  end

  def get_session_by_user_id(user_id) do
    user_id
    |> get_last_session_by_user_query()
    |> Repo.one()
  end

  @spec get_user_name_by_id(non_neg_integer()) :: non_neg_integer() | nil
  def get_user_name_by_id(user_id) do
    with %{name: name} when not is_nil(name)  <- User |> Repo.get(user_id) do
      name
    end
  end

  # %{session_info: %{
  #   "character_id" => id,
  #   "character_name" => name,
  #   "approved" => approved
  # }}

  @spec get_character_session_by_user_id(integer()) :: {:ok, SessionInfo.t()} | {:error, :not_found}
  def get_character_session_by_user_id(user_id) do
    user_id
    |> get_session_by_user_id()
    |> SessionInfo.extract_from_session()
  end

  @spec is_user_master?(integer()) :: boolean()
  def is_user_master?(user_id) do
    User
    |> from()
    |> where([u], u.id == ^user_id)
    |> where([u], u.role == "master")
    |> select([u], count(u.id))
    |> Repo.one() == 1
  end

  @spec update_session(%{:id => non_neg_integer(), optional(any()) => any()}) :: 
    {:ok, Session.t()} | 
    {:error, Ecto.Changeset.t()}
  def update_session(%{id: id}, attrs \\ %{}) do
    new_attrs =
      attrs
      |> Map.put_new(:last_checked, NaiveDateTime.utc_now())
      |> Map.put_new(:user_id, id)

    case get_last_session_by_user_query(id) |> Repo.one() do
      nil ->
        %Session{}
        |> Session.changeset(new_attrs)
        |> Repo.insert()
      session ->
        session
        |> Session.changeset(
          attrs
          |> Map.put(:last_checked, NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)))
        |> Repo.update()
    end
  end

  @spec toggle_session_visible(%{:id => non_neg_integer()}) :: 
    {:ok, Session.t()} | 
    {:error, Ecto.Changeset.t()}
  def toggle_session_visible(%{id: user_id}) do
    case get_session_by_user_id(user_id) do
      nil ->
        {:error, :not_found}

      session ->
        session
        |> Session.changeset(%{visible: not session.visible})
        |> Repo.update()
    end
  end

  def update_session_dynamic_field(%{id: id}, attrs \\ %{}) do
    case get_last_session_by_user_query(id) |> Repo.one() do
      session = %{session_info: info} ->
        new_values =
          (info || %{})
          |> Map.merge(attrs |> VtmAuth.Helpers.atom_map_to_map())

        session
        |> Session.changeset(%{session_info: new_values})
        |> Repo.update()
      _ ->
        {:error, :not_found}
    end
  end

  def has_session_dynamic_fields?(%{id: id}) do
    with %{session_info: session_info} <- Session |> Repo.get_by(user_id: id, completed: false) do
      not is_nil(session_info)
    end
  end

  def clear_session_dynamic_field(%{id: id}) do
    Session
    |> Repo.get_by(user_id: id, completed: false)
    |> Session.changeset(%{session_info: %{}})
    |> Repo.update()
  end

  @spec clear_map_from_session_dynamic_field(%{id: integer()}) :: map() | nil
  def clear_map_from_session_dynamic_field(%{id: id}) do
    case get_last_session_by_user_query(id) |> Repo.one() do
      session = %{session_info: info} ->
        new_values =
          (info || %{})
          |> Map.delete("map_id")
          |> Map.delete("map_name")

        session
        |> Session.changeset(%{session_info: new_values})
        |> Repo.update()
      _ ->
        nil
    end
  end

  def complete_session(user = %{id: user_id}) do
    with u when not is_nil(u) <- get_session_by_user_id(user_id),
         {:ok, s}             <- clear_session_dynamic_field(user) do
      s
      |> Session.changeset(%{completed: true})
      |> Repo.update()
    end
  end

  def get_current_sessions() do
    query =
      from s in Session,
      join: u in User,
      on: s.user_id == u.id,
      where: s.last_checked > ago(^@session_offset, "minute"),
      where: s.visible == true,
      where: not(s.completed),
      select: {u, s}

    Repo.all(query)
    |> Enum.map(fn
      {user, s} ->
        %{
          user: user,
          session_info: SessionInfo.extract_from_session(s)
        }
    end)
  end

  @spec authenticate(binary(), binary(), boolean()) :: {:ok, User.t()} | {:error, any()}
  def authenticate(email, password, remember) do
    with {:ok, user}  <- get_not_banned_user_by_email(email),
          {:ok, user} <- verify_user_password(user, password),
          {:ok, user} <- update_last_login_date(user) do
      update_session(user, %{remember: remember})
      {:ok, user}
    end
  end

  @spec verify_user_password(User.t(), binary()) :: {:ok, User.t()} | {:error, :unauthorized}
  def verify_user_password(user = %{password: digest}, password) do
    case Password.valid?(password, digest) do
      true  -> {:ok, user}
      _     -> {:error, :unauthorized}
    end
  end

  @spec update_last_login_date(User.t()) :: {:ok, User.t()} | {:error, Ecto.Changeset.t()}
  defp update_last_login_date(user) do
    user
    |> User.update_changeset(%{last_login: NaiveDateTime.utc_now()})
    |> Repo.update()
  end

  @spec update_user_relogin_id(User.t(), binary()) :: {:ok, User.t()} | {:error, any()}
  def update_user_relogin_id(user, relogin_id) do
    user
    |> User.update_changeset(%{relogin_token: relogin_id})
    |> Repo.update()
  end

  @spec user_has_relogin_token?(User.t(), binary()) :: :ok | {:error, :not_found}
  def user_has_relogin_token?(%{id: id}, relogin_token) do
    query =
      from u in User,
        where: u.id == ^id,
        where: u.relogin_token == ^relogin_token,
        where: u.banned == false,
        select: count(u.id)

    case Repo.one(query) do
      0 -> {:error, :not_found}
      _ -> :ok
    end
  end

  def create_new_password_request(attrs) do
    %ResetPasswordRequest{}
    |> ResetPasswordRequest.changeset(attrs)
    |> Repo.insert()
  end

  @spec ban_user?(integer(), boolean()) :: User.t()
  def ban_user?(user_id, ban) do
    User
    |> Repo.get(user_id)
    |> User.update_changeset(%{banned: ban})
    |> Repo.update()
  end
end
