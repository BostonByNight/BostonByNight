# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     VtmAuth.Repo.insert!(%VtmAuth.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
case VtmAuth.Accounts.get_user_by_email("postmaster@vtmbaires.eu") do
  {:ok, user = %{email: "postmaster@vtmbaires.eu"}} ->
    {:ok, user}
  _ ->
    VtmAuth.Accounts.create_user(%{
      "email" => "postmaster@vtmbaires.eu",
      "role" => "master",
      "name" => "Storyteller",
      "password" => "huevos!!"
    })
end

case VtmAuth.Accounts.get_user_by_email("masterdp@bostonbynight-gdr.it") do
  {:ok, user = %{email: "masterdp@bostonbynight-gdr.it"}} ->
    {:ok, user}
  _ ->
    VtmAuth.Accounts.create_user(%{
      "email" => "masterdp@bostonbynight-gdr.it",
      "role" => "master",
      "name" => "MasterDP",
      "password" => "PassW0rd1!"
    })
end

case VtmAuth.Accounts.get_user_by_email("masterda@bostonbynight-gdr.it") do
  {:ok, user = %{email: "masterda@bostonbynight-gdr.it"}} ->
    {:ok, user}
  _ ->
    VtmAuth.Accounts.create_user(%{
      "email" => "masterda@bostonbynight-gdr.it",
      "role" => "master",
      "name" => "MasterDA",
      "password" => "PassW0rd1!"
    })
end

case VtmAuth.Accounts.get_user_by_email("utente@bostonbynight-gdr.it") do
  {:ok, user = %{email: "utente@bostonbynight-gdr.it"}} ->
    {:ok, user}
  _ ->
    VtmAuth.Accounts.create_user(%{
      "email" => "utente@bostonbynight-gdr.it",
      "role" => "player",
      "name" => "Utente",
      "password" => "utente"
    })
end

case VtmAuth.Accounts.get_user_by_email("jack@bostonbynight-gdr.it") do
  {:ok, user = %{email: "jack@bostonbynight-gdr.it"}} ->
    {:ok, user}
  _ ->
    VtmAuth.Accounts.create_user(%{
      "email" => "jack@bostonbynight-gdr.it",
      "role" => "player",
      "name" => "jack",
      "password" => "huevos!!"
    })
end
