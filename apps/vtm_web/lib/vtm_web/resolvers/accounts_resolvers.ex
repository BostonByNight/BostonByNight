defmodule VtmWeb.Resolvers.AccountsResolvers do
  @moduledoc false

  require Logger

  alias VtmWeb.Authentication
  alias VtmAuth.Accounts
  alias VtmAuth.Accounts.User
  alias VtmAuth.Accounts.SessionInfo
  alias Vtm.Characters.Character

  import VtmAuth.Helpers

  alias Vtm.Characters
  alias Vtm.Chats

  alias VtmWeb.UserEmail
  alias VtmWeb.Mailer

  def parse_role("master", _), do: :master
  def parse_role(_, _), do: :player

  def me(_, _, %{context: %{current_user: current_user}}) do
    {:ok, current_user}
  end

  def me(_, _, _) do
    {:ok, nil}
  end

  @spec login(map(), map(), map()) :: {:ok, map()} | {:error, binary()}
  def login(_, %{email: email, password: password, remember: remember}, _) do
    case Authentication.login(email, password, remember) do
      {:ok, login_response} ->
        manage_session_character(login_response)
      _ ->
        {:error, "incorrect username or password"}
    end
  end

  @spec manage_session_character(map()) :: {:ok, map()} | {:error, any()}
  defp manage_session_character(login_response = %{user: user, relogin_id: relogin_id}) do
    with {:ok, _}   <- Accounts.update_user_relogin_id(user, relogin_id),
         character  <- get_user_first_character(user),
         {:ok, _}   <- Characters.update_character_in_session(user, character) do
      {:ok, login_response |> Map.put(:character, character)}
    end
  end

  @spec get_user_first_character(User.t()) :: Character.t()
  defp get_user_first_character(user) do
    # Checking whether the user has only one character.
    # In this case, the character will be automatically selected.
    case Characters.get_user_characters(user) do
      [character] -> character
      []          -> %{}
      characters  ->
        [c] =
          # Giving priviledge to non-npc
          characters
          |> Enum.sort(fn
            %{is_npc: false}, %{is_npc: true} -> true
            _, _ -> false
          end)
          |> Enum.take(1)

        c
    end
  end

  def user_name_exists?(_, %{name: name}, _) do
    {:ok, Accounts.user_name_exists?(name)}
  end

  def user_email_exists?(_, %{email: email}, _) do
    {:ok, Accounts.user_email_exists?(email)}
  end

  def send_welcome_message(user_id) do
    Vtm.Messages.send_master_message(user_id, """
    Benvenuto!
    """, """
    Benvenuto in Buenos Aires by Night, il corpo master ti ringrazia per averci scelto e ti augura una buona permanenza!

    Per prima cosa, ti invitiamo ad ambientarti: con l'utente che hai creato potrai visionare il forum, le giocate nelle varie location, e la maggior parte del sito.

    Per giocare, però, dovrai creare un personaggio. Potrai farlo cliccando il tasto "Crea personaggio" nel menu di sinistra. Se incontri difficoltà di qualsiasi genere, contattaci pure su Discord, troverai il link sempre nel menu di sinistra.

    Ti auguriamo ancora una buona permanenza, e speriamo che tu possa divertirti con noi.

    Il team di Buenos Aires by Night.
    """)
  end

  defp send_mail_and_log(mail) do
    case Mailer.deliver(mail) do
      ok_response = {:ok, _}  -> ok_response
      e ->
        Logger.error("There was an error while sending the email: #{inspect e}")
        e
    end
  end

  def create(_, request = %{email: email, name: user_name}, _) do
    new_password = generate_password(10)

    request =
      request
      |> Map.put_new(:role, "PLAYER")
      |> Map.put(:password, new_password)

    with {:ok, %User{id: id}} <- Accounts.create_user(request),
         mail                 <- UserEmail.welcome(user_name, email, new_password),
         {:ok, _}             <- send_mail_and_log(mail) do
      Task.start(fn -> send_welcome_message(id) end)
      {:ok, %{id: id}}
    end
  end

  def all(_, _, _) do
    {:ok, Accounts.get_all_users()}
  end

  defp parse_session(%{
    user: user,
    session_info: {:ok, %SessionInfo{
      approved: approved,
      character_id: c_id,
      character_name: c_name,
      map_id: location_id,
      map_name: location_name
    }}
  }) when not is_nil(location_id) and location_id != 0, do: %{
    user: user,
    character: %{
      id: c_id,
      name: c_name,
      approved: approved
    },
    location: %{
      id: location_id,
      name: location_name
    }
  }

  defp parse_session(%{
    user: user,
    session_info: {:ok, %SessionInfo{
      approved: approved,
      character_id: c_id,
      character_name: c_name
    }}
  }), do: %{
    user: user,
    character: %{
      id: c_id,
      name: c_name,
      approved: approved
    }
  }

  defp parse_session(s), do: s

  def all_sessions(_, _, _) do
    sessions =
      Accounts.get_current_sessions()
      |> Enum.map(&parse_session(&1))

    {:ok, sessions}
  end

  def user_online_visible(_, _, %{context: %{current_user: %{id: user_id}}}) do
    case Accounts.get_session_by_user_id(user_id) do
      %{visible: visible} -> 
        {:ok, visible}

      _ -> 
        {:error, :not_found}
    end
  end

  def token(_, _, %{context: %{current_user: current_user}}) do
    {:ok, VtmWeb.Authentication.sign_subscription_key_token(current_user)}
  end

  def update_session_character(%{character_id: id}, %{context: %{current_user: user}}) do
    with character      <- Characters.get_specific_character(user, id),
         mapped_request <- %{
           character_id: character.id,
           character_name: character.name,
           approved: character.approved
         },
      {:ok, %{session_info: %{
        character_id: id,
        character_name: name,
        approved: approved
      }}} <- Accounts.update_session_dynamic_field(user, mapped_request) do
      {:ok, %{
        id: id,
        name: name,
        approved: approved
      }}
    end
  end

  def update_session_map(%{map_id: id}, %{context: %{current_user: user}}) do
    case Accounts.has_session_dynamic_fields?(user) do
      true ->
        with {:ok, parsed_request}              <- Chats.enrich_map_id_for_session(id),
             {:ok, session}                     <- Accounts.update_session_dynamic_field(user, parsed_request),
             %{session_info: %{"map_id" => id}} <- session do
          {:ok, id}
        end
      false ->
        {:error, :not_found}
    end
  end

  def toggle_session_visible(_, _, %{context: %{current_user: user}}) do
    with {:ok, %{visible: visible}} <- Accounts.toggle_session_visible(user) do
      {:ok, visible}
    end
  end

  def reset_session_map(_, _, %{context: %{current_user: user}}) do
    case Accounts.has_session_dynamic_fields?(user) do
      true ->
        Accounts.clear_map_from_session_dynamic_field(user)
        {:ok, true}
      false ->
        {:error, :not_found}
    end
  end

  def clear_session(_, _, %{context: %{current_user: user}}) do
    with {:ok, _} <- Accounts.clear_session_dynamic_field(user) do
      {:ok, true}
    end
  end

  def logout(_, _, %{context: %{current_user: user}}) do
    # The function has to return ok even if something went wrong
    _ = Accounts.complete_session(user)
    {:ok, true}
  end

  def update_user_password(_, %{
    old_password: old,
    new_password: new,
    repeat_password: new
  }, %{context: %{current_user: %{id: id}}}) do
    with {:ok, user}  <- Accounts.get_user(id),
         {:ok, _}     <- Accounts.authenticate(user.email, old, false),
         {:ok, _}     <- user |> Accounts.update_user(%{password: new}) do
      {:ok, true}
    end
  end

  def request_new_password(_, %{user_email: user_email}, _) do
    with {:ok, user}  <- Accounts.get_user_by_email(user_email),
         new_password <- generate_password(10),
         mail         <- VtmWeb.UserEmail.recover_password(user.name, user.email, new_password),
         {:ok, _}     <- VtmWeb.Mailer.deliver(mail),
         {:ok, _}     <- user |> Accounts.update_user(%{password: new_password}) do
      {:ok, true}
    end
  end
end
