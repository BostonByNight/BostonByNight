defmodule VtmWeb.Schema.Middlewares.AuthorizeCharacterId do
  @behaviour Absinthe.Middleware

  alias Vtm.Characters
  import VtmWeb.Resolvers.Helpers

  def call(resolution = %{
    arguments: %{character_id: character_id},
    context: %{current_user: %{id: user_id, role: role}}
  }, _) do
    case {role, Characters.character_of_user?(user_id, from_global_id?(character_id))} do
      {:master, _}  -> resolution
      {true, _}     -> resolution
      _             ->
        resolution
        |> Absinthe.Resolution.put_result({:error, "unauthorized"})
    end
  end
end
