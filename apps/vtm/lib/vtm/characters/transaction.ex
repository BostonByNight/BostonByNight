defmodule Vtm.Characters.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  alias Vtm.Characters.Character
  alias VtmAuth.Accounts.User

  @type t() :: %__MODULE__{
    id: non_neg_integer(),

    amount: integer(),
    reason: binary(),

    character_id: non_neg_integer(),
    character: Character.t(),

    to_character_id: non_neg_integer(),
    to_character: Character.t(),

    master_user_id: non_neg_integer(),
    master_user: User.t(),

    inserted_at: NaiveDateTime.t(),
    updated_at: NaiveDateTime.t()
  }

  schema "transactions" do
    field :amount, :integer
    field :reason, :string

    belongs_to :character, Character
    belongs_to :to_character, Character
    belongs_to :master_user, User

    timestamps()
  end

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:character_id, :to_character_id, :master_user_id, :amount, :reason])
    |> foreign_key_constraint(:character_id)
    |> foreign_key_constraint(:to_character_id)
    |> foreign_key_constraint(:master_user_id)
    |> validate_required([:amount])
  end
end
