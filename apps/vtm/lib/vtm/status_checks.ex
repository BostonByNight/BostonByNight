defmodule Vtm.StatusChecks do
  @moduledoc false

  import Ecto.Query, warn: false
  alias Ecto.Changeset

  alias Vtm.Repo
  alias Vtm.Helpers
  alias Vtm.Characters
  alias Vtm.Characters.Character
  alias Vtm.Havens.Haven
  alias Vtm.Havens.Event

  defp update_character(character, changes) do
    character
    |> Character.update_changeset(changes)
    |> Repo.update()
  end

  def character_status(character_id) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{
          id: c.id,
          humanity: c.humanity,
          last_hunt: c.last_hunt,
          last_resonance: c.last_resonance,
          last_resonance_intensity: c.last_resonance_intensity,
          hunger: c.hunger,
          stains: c.stains,
          blood_potency: c.blood_potency,
          willpower: c.willpower,
          willpower_damage: c.willpower_damage,
          health: c.health,
          damage: c.damage,
          aggravated_damage: c.aggravated_damage,
          money: c.money
        }

    Repo.one(query)
  end

  @spec rouse_check_effect(integer(), boolean()) :: {:error, :not_found} |
                                                    {:ok, :no_rouse} |
                                                    {:ok, :rouse} |
                                                    {:ok, :frenzy}
  def rouse_check_effect(character_id, allow_rethrow \\ true) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{id: c.id, hunger: c.hunger, blood_potency: c.blood_potency}

    case {Repo.one(query), allow_rethrow, Helpers.throw_dice(), Helpers.throw_dice()} do
      {nil, _,  _, _} ->
        {:error, :not_found}
      {%{hunger: 5}, _, _, _} ->
        {:ok, :frenzy}
      {_, _, d, _} when d >= 6 ->
        {:ok, :no_rouse}
      {%{blood_potency: bp}, true, _, d} when bp >= 1 and d >= 6 ->
        {:ok, :no_rouse}
      {ch = %{hunger: h}, _, _, _} ->
        with {:ok, _} <- ch |> update_character(%{hunger: h + 1}) do
          {:ok, :rouse}
        end
    end
  end

  @doc """
  This function implements the Rouse Check. It doesn't check whether the character belongs to a particular user.
  """
  @spec rouse_check(non_neg_integer()) :: {:ok, binary()} | {:error, binary()} | {:error, :not_found}
  def rouse_check(character_id) do
    case rouse_check_effect(character_id) do
      {:ok, :frenzy} ->
        {:ok, "Il personaggio è sulla soglia della frenesia, deve cibarsi prima di poter spendere vitae."}
      {:ok, :no_rouse} ->
        {:ok, "Il personaggio personaggio riesce ad usare efficientemente la sua vitae."}
      {:ok, :rouse} ->
        {:ok, "Il personaggio riesce ad usare vitae, ma la sua fame cresce."}
      e -> e
    end
  end

  @doc """
  This function applies the damage to a character, returning the current state of the character itself.
  """
  @spec apply_damage(non_neg_integer(), non_neg_integer(), :aggravated | :superficial) :: {:ok, binary()}
  def apply_damage(character_id, damage_entity, :superficial) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{id: c.id, health: c.health, damage: c.damage, aggravated_damage: c.aggravated_damage}

    case {Repo.one(query), damage_entity} do
      {%{health: health, damage: health, aggravated_damage: health}, _} ->
        {:ok, "Il personaggio è già in torpore"}
      {ch = %{health: health, damage: health, aggravated_damage: ad}, damage} when ad + damage >= health ->
        with {:ok, _} <- ch |> update_character(%{aggravated_damage: health, damage: 0, torpor: true}) do
          {:ok, "Il personaggio entra in torpore"}
        end
      {ch = %{health: health, damage: d, aggravated_damage: ad}, damage} when d + ad == health ->
        with {:ok, _} <- ch |> update_character(%{aggravated_damage: ad + damage, damage: health - ad - damage}) do
          {:ok, "Il personaggio ha subito #{ad + damage} danni aggravati in tutto."}
        end
      {ch = %{health: health, damage: d}, damage} when d + damage >= health ->
        with {:ok, _} <- ch |> update_character(%{damage: health}) do
          apply_damage(character_id, damage + d - health, :superficial)
        end
      {ch = %{damage: d}, damage} ->
        with {:ok, _} <- ch |> update_character(%{damage: d + damage}) do
          {:ok, "Il personaggio ha subito #{d + damage} danni in tutto."}
        end
    end
  end

  def apply_damage(character_id, damage_entity, :aggravated) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{id: c.id, health: c.health, damage: c.damage, aggravated_damage: c.aggravated_damage}

    case {Repo.one(query), damage_entity} do
      {ch = %{health: health, aggravated_damage: health}, _} ->
        with {:ok, _} <- ch |> update_character(%{dead: true}) do
          {:ok, "Il personaggio raggiunge la morte ultima."}
        end
      {ch = %{health: health, aggravated_damage: ad}, damage} when ad + damage >= health ->
        with {:ok, _} <- ch |> update_character(%{aggravated_damage: health, torpor: true}) do
          {:ok, "Il personaggio entra in torpore per le ferite riportate."}
        end
      {ch = %{health: h, damage: d, aggravated_damage: ad}, damage} when (ad + damage) > (h - d) ->
        with {:ok, _} <- ch |> update_character(%{aggravated_damage: ad + damage, damage: h - ad - damage}) do
          {:ok, "Il personaggio ha subito #{ad + damage} danni aggravati."}
        end
      {ch = %{aggravated_damage: ad}, damage} ->
        with {:ok, _} <- ch |> update_character(%{aggravated_damage: ad + damage}) do
          {:ok, "Il personaggio ha subito #{ad + damage} danni aggravati."}
        end
    end
  end

  defp healing_rouse_check(character = %{hunger: h}) do
    case {h, Helpers.throw_dice()} do
      {5, _} ->
        {:ok, "Il personaggio è sull'orlo della frenesia."}
      {_, d} when d >= 6 ->
        {:ok, "Il personaggio riesce a spendere vitae per curarsi."}
      {hunger, _} ->
        with {:ok, _} <- character |> update_character(%{hunger: hunger + 1}) do
          {:ok, "Il personaggio riesce a spendere vitae per curarsi, ma il ruggito della Bestia si fa più forte."}
        end
    end
  end

  defp healing_power(blood_potency) when blood_potency <= 1, do: 1
  defp healing_power(blood_potency) when blood_potency <= 3, do: 2
  defp healing_power(_), do: 3

  def heal(character_id) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{
          id: c.id,
          health: c.health,
          hunger: c.hunger,
          blood_potency: c.blood_potency,
          damage: c.damage,
          hunger: c.hunger
        }
    case Repo.one(query) do
      %{torpor: true} ->
        {:ok, "Il personaggio non può più curarsi: è in torpore."}
      %{damage: d} when d == 0 ->
        {:ok, "Il personaggio non ha bisogno di curarsi."}
      ch = %{damage: d, blood_potency: bp} ->
        with {:ok, updated_ch} <- ch |> update_character(%{damage: d - healing_power(bp)}) do
          healing_rouse_check(updated_ch)
        end
    end
  end

  def use_willpower(character_id) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{
          id: c.id,
          willpower: c.willpower,
          willpower_damage: c.willpower_damage
        }

    case Repo.one(query) do
      %{willpower: w, willpower_damage: w} ->
        {:ok, "Il personaggio non ha più Forza di Volontà da spendere"}
      ch = %{willpower_damage: wd} ->
        with {:ok, _} <- ch |> update_character(%{willpower_damage: wd + 1}) do
          {:ok, "Il personaggio riesce a spendere Forza di Volontà"}
        end
    end
  end

  def heal_willpower(character_id, quantity) do
    query =
      from c in Character,
        where: c.id == ^character_id,
        select: %Character{
          id: c.id,
          willpower: c.willpower,
          willpower_damage: c.willpower_damage
        }

    case Repo.one(query) do
      %{willpower_damage: 0} ->
        {:ok, "Il personaggio recupera forza di volontà."}
      ch = %{willpower_damage: wd} when wd < quantity ->
        with {:ok, _} <- ch |> update_character(%{willpower_damage: 0}) do
          {:ok, "Il personaggio recupera forza di volontà."}
        end
      ch = %{willpower_damage: wd} ->
        with {:ok, _} <- ch |> update_character(%{willpower_damage: wd - quantity}) do
          {:ok, "Il personaggio recupera forza di volontà."}
        end
    end
  end

  defp at_least_zero(n) when n < 0, do: 0
  defp at_least_zero(n), do: n

  defp at_least_one(n) when n < 1, do: 1
  defp at_least_one(n), do: n

  defp less_than_5(x) when x > 5, do: 5
  defp less_than_5(x), do: x

  defp parse_throw(dices, tens \\ 0, successes \\ 0, ones \\ 0)
  defp parse_throw([], tens, successes, ones), do: {tens, successes, ones}
  defp parse_throw([x | rest], tens, successes, ones) when x == 10, do: parse_throw(rest, tens + 1, successes + 1, ones)
  defp parse_throw([x | rest], tens, successes, ones) when x == 1, do: parse_throw(rest, tens, successes, ones + 1)
  defp parse_throw([x | rest], tens, successes, ones) when x >= 6, do: parse_throw(rest, tens, successes + 1, ones)
  defp parse_throw([_ | rest], tens, successes, ones), do: parse_throw(rest, tens, successes, ones)

  @spec awake_character(non_neg_integer()) :: {:error, any()} | {:ok, binary()}
  def awake_character(character_id) do
    with {:ok, result}  <- awake_character_effect(character_id),
         {:ok, _}       <- Character
          |> Repo.get(character_id)
          |> Character.changeset(%{last_awake: NaiveDateTime.utc_now()})
          |> Repo.update() do
      {:ok, result}
    end
  end

  defp awake_character_effect(character_id) do
    case {character_id |> Characters.is_character_awake(), character_id |> rouse_check_effect(false)} do
      {true, _}             -> {:error, "Il personaggio è già sveglio."}
      {_, {:ok, :no_rouse}} -> {:ok, "Il personaggio si sveglia senza avvertire i morsi della Fame."}
      {_, {:ok, :rouse}}    -> {:ok, "Il personaggio si sveglia avvertendo i morsi della Fame."}
      {_, {:ok, :frenzy}}   -> {:ok, "Il personaggio si sveglia sulla soglia della frenesia!"}
      e                     -> e
    end
  end

  defp update_hunger(character = %{hunger: hunger}, updater) do
    character
    |> Character.update_changeset(%{hunger: updater.(less_than_5(hunger))})
    |> Repo.update()
  end

  defp increase_hunger(character, amount), do: update_hunger(character, &(&1 + amount))

  defp decrease_hunger(character, amount), do: update_hunger(character, &at_least_one(&1 - amount))

  def get_hunt_attributes_amount(%{id: character_id}) do
    character_id
    |> Characters.get_character_predator_type_skills()
    |> Enum.map(fn %{value: v} -> v end)
    |> Enum.sum()
  end

  @spec get_hunt_difficulty(Character.t(), Haven.t()) :: non_neg_integer()
  def get_hunt_difficulty(%{id: c_id, hunt_difficulty: c_hd}, %{character_id: c_id, owner_difficulty: h_hd}), do: at_least_zero(c_hd + h_hd)
  def get_hunt_difficulty(%{hunt_difficulty: c_hd}, %{difficulty: h_hd}), do: at_least_zero(c_hd + h_hd)

  @spec determine_hunger(Character.t(), Haven.t()) :: {:ok, binary(), Character.t()} | {:no_hunt, binary(), Character.t()}
  defp determine_hunger(character, haven) do
    with amount     <- get_hunt_attributes_amount(character),
         difficulty <- get_hunt_difficulty(character, haven) do
      case {difficulty, Helpers.random_dice_thrower(amount) |> parse_throw()} do
        {0, {0, 0, o}} when o > 0 ->
          with {:ok, character} <- character |> increase_hunger(2),
               message          <-  "Il personaggio fallisce la caccia." do
            {:no_hunt, message, character}
          end
        {_, {0, 0, o}} when o > 0 ->
          with {:ok, character} <- character |> increase_hunger(2),
               message          <-  "Il personaggio fallisce clamorosamente la caccia." do
            {:no_hunt, message, character}
          end
        {_, {_, s, _}} when s < difficulty ->
          with {:ok, character} <- character |> increase_hunger(1),
               message          <- "Il personaggio fallisce la caccia." do
            {:no_hunt, message, character}
          end
        {_, {t, s, o}} ->
          with decrease         <- s + at_least_zero(t - o) - difficulty + 1,
               message          <- "Il personaggio riesce a cacciare.",
               {:ok, character} <- character |> decrease_hunger(decrease) do
            {:ok, message, character}
          end
      end
    end
  end

  @spec determine_resonance_power(binary() | nil) :: non_neg_integer()
  defp determine_resonance_power(resonance) when not is_nil(resonance) do
    case Helpers.throw_dice() do
      x when x >= 10  -> 4
      x when x >= 9   -> 3
      x when x >= 6   -> 2
      _               -> 1
    end
  end

  defp determine_resonance_power(_) do
    case {Helpers.throw_dice(), Helpers.throw_dice()} do
      {x, r} when x >= 9 and r >= 9 -> 4
      {x, _} when x >= 9            -> 3
      {x, _} when x >= 6            -> 2
      _                             -> 1
    end
  end

  @spec get_resonance_types() :: list(binary())
  def get_resonance_types(), do: [
    "Animale",
    "Flemmatica",
    "Collerica",
    "Malinconica",
    "Sanguigna"
  ]

  @spec get_other_resonance_types(binary()) :: list(binary())
  defp get_other_resonance_types(resonance) do
    get_resonance_types()
    |> Enum.filter(fn
      ^resonance  -> false
      _           -> true
    end)
  end

  @spec determine_resonance_type(Character.t(), binary() | nil) :: binary()
  defp determine_resonance_type(%{id: character_id}, resonance) when not is_nil(resonance) do
    [
      first,
      second,
      third,
      fourth | _
    ] = get_other_resonance_types(resonance)

    is_vegan_hunger = Characters.is_character_vegan_hunter?(character_id)

    case {is_vegan_hunger, Helpers.throw_dice()} do
      {true, _}           -> "Animale"
      {_, x} when x == 10 -> first
      {_, x} when x == 9  -> second
      {_, x} when x == 8  -> third
      {_, x} when x == 7  -> fourth
      _                   -> resonance
    end
  end

  defp determine_resonance_type(%{id: character_id}, _) do
    case {Characters.is_character_vegan_hunter?(character_id), Helpers.throw_dice()} do
      {true, _}           -> "Animale"
      {_, x} when x == 9  -> "Flemmatica"
      {_, x} when x >= 7  -> "Collerica"
      {_, x} when x >= 5  -> "Malinconica"
      {_, x} when x >= 2  -> "Sanguigna"
      _                   -> "Animale"
    end
  end

  @spec determine_resonance(Character.t(), Haven.t()) :: {:ok, non_neg_integer(), binary(), Character.t()} | {:error, Changeset.t()}
  defp determine_resonance(character, %{resonance: resonance}) do
    with power            <- determine_resonance_power(resonance),
         type             <- determine_resonance_type(character, resonance),
         {:ok, character} <- character
                             |> Character.update_changeset(%{last_resonance: type, last_resonance_intensity: power})
                             |> Repo.update() do
      {:ok, power, type, character}
    end
  end

  defp set_new_hunt_time(character) do
    character
    |> Character.update_changeset(%{last_hunt: NaiveDateTime.utc_now()})
    |> Repo.update()
  end

  defp enrich_message_with_resonance(hunt_message, power_level, type) do
    power_level_message =
      case power_level do
        1 -> "trascurabile"
        2 -> "fugace"
        3 -> "intensa"
        4 -> "acuta (discrasia)"
      end

    "#{hunt_message} La vitae estratta dalla preda concede una risonanza #{type} #{power_level_message}."
  end

  @spec preload_event_info({:ok, Event.t()} | {:error, Changeset.t()}) :: {:ok, Event.t()} | {:error, Changeset.t()}
  defp preload_event_info({:ok, event}) do
    {:ok,
      event
      |> Repo.preload(haven: :character)
    }
  end

  defp preload_event_info(e), do: e

  @spec determine_consequences(Character.t(), Haven.t()) :: {:ok, nil | Event.t()} | {:error, any}
  defp determine_consequences(%{id: c_id}, %{id: haven_id, character_id: c_id}) do
    _ = insert_empty_event(c_id, haven_id)
    {:ok, nil}
  end

  defp determine_consequences(%{id: c_id}, %{id: haven_id, danger: danger, ground_control: ground_control}) do
    case {Helpers.throw_dice(), Helpers.throw_dice()} do
      {x, y} when x <= danger or y <= ground_control  ->
        %Event{}
        |> Event.changeset(%{
          character_id: c_id,
          haven_id: haven_id,
          danger_triggered: x <= danger,
          control_triggered: y <= ground_control})
        |> Repo.insert()
        |> preload_event_info()
      _                               ->
        _ = insert_empty_event(c_id, haven_id)
        {:ok, nil}
    end
  end

  @spec insert_empty_event(non_neg_integer(), non_neg_integer()) :: {:ok, Event.t()} | {:error, Changeset.t()}
  defp insert_empty_event(c_id, haven_id) do
    %Event{}
    |> Event.changeset(%{
      character_id: c_id,
      haven_id: haven_id,
      danger_triggered: false,
      control_triggered: false,
      resolved: true
    })
    |> Repo.insert()
  end

  @spec perform_hunt(Character.t(), Haven.t()) :: {:ok, {binary(), Character.t(), Event.t() | nil}} | {:error, any()}
  defp perform_hunt(character, haven) do
    with {:ok, message, character}      <- determine_hunger(character, haven),
         {:ok, power, type, character}  <- determine_resonance(character, haven),
         {:ok, event}                   <- determine_consequences(character, haven) do
      {:ok, {
        message |> enrich_message_with_resonance(power, type),
        character,
        event
      }}
    else
      # If the character failed the hunt, it is not considered an error...
      {:no_hunt, message, character} ->
        # ... but there would be possible consequences
        with {:ok, event}                   <- determine_consequences(character, haven) do
          {:ok, {message, character, event}}
        end
      e ->
        e
    end
  end

  @doc """
  Simulates the character hunting.
  It considers the Herd Advantage while performing a throw of Wits + Survival.
  """
  @spec hunt(non_neg_integer(), non_neg_integer()) :: {:ok, {binary(), Character.t(), Event.t() | nil}}
  def hunt(character_id, haven_id) do
    character = %{last_hunt: last_hunt} = Character |> Repo.get(character_id)
    haven = Haven |> Repo.get(haven_id)

    case Helpers.at_least_one_day?(last_hunt) do
      false ->
        {:ok, {"L'ultima caccia risale a meno di un giorno fa.", character, nil}}
      true ->
        # Updating the hunt only if no technical errors occoured
        with {:ok, {message, character, event}} <- perform_hunt(character, haven),
             {:ok, character}                   <- character |> set_new_hunt_time() do
          {:ok, {message, character, event}}
        end
    end
  end

  def reset_hunt(character_id) do
    Character
    |> Repo.get(character_id)
    |> Character.changeset(%{last_hunt: nil})
    |> Repo.update()
  end
end
