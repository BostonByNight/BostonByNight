defmodule Vtm.LocationsSeedsHelpers do
  import Ecto.Query
  require Logger

  def insert_map(attrs = %Vtm.Chats.ChatMap{name: name, description: description, is_chat: is_chat, chat_map_id: chat_map_id}) do
    is_private =
      case attrs do
        %{is_private: true} -> true
        _ -> false
      end

    case Vtm.Repo.get_by(Vtm.Chats.ChatMap, name: name) do
      nil ->
        %Vtm.Chats.ChatMap{}
        |> Vtm.Chats.ChatMap.changeset(%{name: name, description: description, is_chat: is_chat, chat_map_id: chat_map_id, is_private: is_private})
        |> Vtm.Repo.insert()
      place ->
        place
        |> Vtm.Chats.ChatMap.changeset(%{description: description})
        |> Vtm.Repo.update()
    end
  end

  def get_or_insert_map(attrs = %Vtm.Chats.ChatMap{name: name}) do
    query =
      from a in Vtm.Chats.ChatMap,
        where: a.name == ^name

    case Vtm.Repo.one(query) do
      nil -> insert_map(attrs)
      a   -> {:ok, a}
    end
  end

  def update_chat_entries(chat_id_from, chat_id_to) do
    from(c in Vtm.Chats.ChatEntry, where: c.chat_map_id == ^chat_id_from)
    |> Vtm.Repo.update_all(set: [chat_map_id: chat_id_to])
  end
end

{:ok, %{id: old_boston_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Old Boston", is_chat: false})
{:ok, %{id: north_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "North Boston", is_chat: false})
{:ok, %{id: west_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "West Boston", is_chat: false})
{:ok, %{id: south_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "South Boston", is_chat: false})
{:ok, %{id: east_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "East Boston", is_chat: false})
{:ok, %{id: private_chats_id}} = Vtm.LocationsSeedsHelpers.get_or_insert_map(%Vtm.Chats.ChatMap{name: "Chat Private", is_chat: false})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Eagle Hill", description: "", is_chat: true, chat_map_id: east_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Orient Height", description: "", is_chat: true, chat_map_id: east_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Wood Jeffries Point", description: "", is_chat: true, chat_map_id: east_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Aereoporto", description: "", is_chat: true, chat_map_id: east_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "North End", description: "", is_chat: true, chat_map_id: north_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "West End", description: "", is_chat: true, chat_map_id: north_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Downtown", description: "", is_chat: true, chat_map_id: north_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Beacon Hill", description: "", is_chat: true, chat_map_id: north_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "South Boston", description: "", is_chat: true, chat_map_id: south_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chinatown", description: "", is_chat: true, chat_map_id: south_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Columbus Park", description: "", is_chat: true, chat_map_id: south_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "West Broadway", description: "", is_chat: true, chat_map_id: south_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Back Bay", description: "", is_chat: true, chat_map_id: west_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Bay Village", description: "", is_chat: true, chat_map_id: west_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "South End", description: "", is_chat: true, chat_map_id: west_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Lower Roxbury", description: "", is_chat: true, chat_map_id: west_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Charlestown", description: "", is_chat: true, chat_map_id: old_boston_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Central Square", description: "", is_chat: true, chat_map_id: old_boston_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Area 2/Mit", description: "", is_chat: true, chat_map_id: old_boston_id})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Cambridge Port", description: "", is_chat: true, chat_map_id: old_boston_id})

Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 1", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 2", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 3", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 4", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})
Vtm.LocationsSeedsHelpers.insert_map(%Vtm.Chats.ChatMap{name: "Chat Privata 5", description: """
""", is_chat: true, chat_map_id: private_chats_id, is_private: true})

# Vtm.LocationsSeedsHelpers.update_chat_entries(confiteria_del_molino_id, anticamera_id)
