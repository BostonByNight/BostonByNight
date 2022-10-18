defmodule Vtm.Helpers do
  @moduledoc false

  @spec nil_or_value_to_error_tuple(nil | any()) :: {:ok, any()} | {:error, :not_found}
  def nil_or_value_to_error_tuple(value) do
    case value do
      nil -> {:error, :not_found}
      v   -> {:ok, v}
    end
  end

  defp key_tuple_to_atom({key, value}) when is_binary(key), do: {String.to_atom(key), value}
  defp key_tuple_to_atom(t), do: t

  @spec map_to_atom_map(map()) :: map()
  def map_to_atom_map(map) do
    map
    |> Map.new(&key_tuple_to_atom/1)
  end

  def throw_dice() do
    :rand.uniform(10)
  end

  @spec random_dice_thrower(integer()) :: [integer()]
  def random_dice_thrower(amount) do
    1..amount
    |> Enum.map(fn _ -> throw_dice() end)
  end

  def unzip(collection, condition, first \\ [], second \\ [])

  def unzip([], _, first, second), do: {first |> Enum.reverse(), second |> Enum.reverse()}

  def unzip([a | rest], condition, first, second) do
    case condition.(a) do
      true -> unzip(rest, condition, [a | first], second)
      false -> unzip(rest, condition, first, [a | second])
    end
  end

  @doc """
  Reduces the possible errors in a collection of results, that can be :ok or :error tuple.
  The second argument deterines which object will be returned if everything went ok.
  """
  @spec reduce_errors([{:ok, any()} | {:error, any()}], {:ok, any()}) :: {:ok, any()} | {:error, [any()]}
  def reduce_errors(results, ok_final_state) do
    results
    |> Enum.reduce(ok_final_state, fn
      {:ok, _}, r               -> r
      e = {:error, _}, {:ok, _} -> e
      {:error, e}, {:error, ee} -> {:error, [e | ee]}
    end)
  end

  def add_one_day(date) do
    date
    |> NaiveDateTime.add(3_600 * 24, :second)
  end

  def at_least_one_day?(date) do
    case date do
      nil -> true
      _ ->
        diff =
          add_one_day(date)
          |> NaiveDateTime.diff(NaiveDateTime.utc_now())

        diff < 0
    end
  end

  @spec format_date_time(NaiveDateTime.t()) :: binary()
  def format_date_time(date) do
    case date |> NaiveDateTime.to_string() |> String.split(".") do
      [formatted | _] -> formatted
      _               -> date |> NaiveDateTime.to_date()
    end
  end

  @doc """
  Transform a struct to a map.
  """
  @spec struct_to_map(struct()) :: map()
  def struct_to_map(struct) do
    struct
    |> Map.from_struct()
    |> Map.new(fn {k, v} -> {k |> to_string(), v} end)
    |> Map.delete("__meta__")
  end
end
