defmodule Vtm.Characters.Character do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset

  alias VtmAuth.Accounts.User
  alias Vtm.Characters.Clan
  alias Vtm.Characters.PredatorType

  @type t :: %__MODULE__{
    id: non_neg_integer(),
    name: binary(),
    avatar: binary(),
    chat_avatar: binary(),
    biography: binary(),
    description: binary(),
    soundtrack: binary(),
    off: binary(),
    is_npc: boolean(),
    is_complete: boolean(),
    experience: non_neg_integer(),
    total_experience: non_neg_integer(),
    humanity: non_neg_integer(),
    generation: non_neg_integer(),
    hunger: non_neg_integer(),
    health: non_neg_integer(),
    damage: non_neg_integer(),
    aggravated_damage: non_neg_integer(),
    willpower: non_neg_integer(),
    willpower_damage: non_neg_integer(),
    stains: non_neg_integer(),
    blood_potency: non_neg_integer(),
    last_resonance: binary(),
    last_hunt: NaiveDateTime.t(),
    hunt_difficulty: non_neg_integer(),
    last_awake: NaiveDateTime.t(),
    is_awake: boolean(),
    last_resonance_intensity: non_neg_integer(),
    torpor: boolean(),
    dead: boolean(),
    stage: non_neg_integer(),
    approved: boolean(),
    advantages: binary(),
    notes: binary(),
    discipline_powers: binary(),
    specialties: binary(),
    convictions: binary(),
    objects: binary(),
    user_id: non_neg_integer(),
    user: User.t(),
    clan_id: non_neg_integer(),
    clan: Clan.t(),
    predator_type_id: non_neg_integer(),
    predator_type: PredatorType.t(),
    money: integer(),
    inserted_at: NaiveDateTime.t(),
    updated_at: NaiveDateTime.t(),
  }

  schema "characters" do
    field :name, :string
    field :avatar, :string
    field :chat_avatar, :string
    field :biography, :string
    field :description, :string
    field :soundtrack, :string
    field :off, :string
    field :is_npc, :boolean
    field :is_complete, :boolean
    field :experience, :integer
    field :total_experience, :integer
    field :humanity, :integer
    field :generation, :integer
    field :hunger, :integer
    field :health, :integer
    field :damage, :integer
    field :aggravated_damage, :integer
    field :willpower, :integer
    field :willpower_damage, :integer
    field :stains, :integer
    field :blood_potency, :integer
    field :last_resonance, :string
    field :last_hunt, :naive_datetime
    field :hunt_difficulty, :integer
    field :last_awake, :naive_datetime
    field :is_awake, :boolean, virtual: true
    field :last_resonance_intensity, :integer
    field :torpor, :boolean
    field :dead, :boolean

    field :stage, :integer
    field :approved, :boolean
    field :advantages, :string
    field :notes, :string
    field :discipline_powers, :string
    field :specialties, :string
    field :convictions, :string
    field :objects, :string
    field :money, :integer

    belongs_to :user, User
    belongs_to :clan, Clan
    belongs_to :predator_type, PredatorType

    timestamps()
  end

  def complete_changeset(character, attrs) do
    character
    |> cast(attrs, [:advantages, :discipline_powers, :specialties, :convictions, :notes, :predator_type_id, :is_complete])
    |> foreign_key_constraint(:clan_id)
    |> foreign_key_constraint(:predator_type_id)
    |> validate_required([:advantages, :convictions, :notes, :predator_type_id])
  end

  def add_human_advantages_character_changeset(character, attrs) do
    character
    |> cast(attrs, [:advantages, :notes])
    |> validate_required([:advantages])
  end

  def add_advantages_character_changeset(character, attrs) do
    character
    |> cast(attrs, [:advantages, :discipline_powers, :specialties, :convictions, :notes, :predator_type_id])
    |> foreign_key_constraint(:predator_type_id)
    |> validate_required([:advantages, :convictions, :predator_type_id])
  end

  def finalize_character_changeset(character, attrs) do
    character
    |> cast(attrs, [:is_complete, :willpower, :health, :hunger])
    |> validate_required([:is_complete, :willpower, :health, :hunger])
  end

  def update_changeset(character, attrs) do
    character
    |> cast(attrs, [
      :avatar,
      :chat_avatar,
      :biography,
      :description,
      :soundtrack,
      :off,
      :is_npc,
      :is_complete,
      :experience,
      :total_experience,
      :humanity,
      :generation,
      :hunger,
      :health,
      :damage,
      :aggravated_damage,
      :willpower,
      :willpower_damage,
      :stains,
      :advantages,
      :notes,
      :discipline_powers,
      :specialties,
      :convictions,
      :objects,
      :stage,
      :approved,
      :predator_type_id,
      :blood_potency,
      :last_resonance,
      :last_resonance_intensity,
      :last_hunt,
      :hunt_difficulty,
      :last_awake,
      :torpor,
      :dead,
      :money
    ])
    |> foreign_key_constraint(:clan_id)
    |> foreign_key_constraint(:predator_type_id)
  end

  @doc false
  def changeset(character, attrs) do
    character
    |> cast(attrs, [
      :name,
      :avatar,
      :chat_avatar,
      :biography,
      :description,
      :is_npc,
      :is_complete,
      :experience,
      :total_experience,
      :humanity,
      :generation,
      :hunger,
      :health,
      :damage,
      :aggravated_damage,
      :willpower,
      :willpower_damage,
      :stains,
      :stage,
      :approved,
      :user_id,
      :clan_id,
      :predator_type_id,
      :advantages,
      :notes,
      :discipline_powers,
      :specialties,
      :convictions,
      :objects,
      :blood_potency,
      :last_resonance,
      :last_resonance_intensity,
      :last_hunt,
      :hunt_difficulty,
      :last_awake,
      :torpor,
      :dead,
      :money
    ])
    |> foreign_key_constraint(:user_id)
    |> foreign_key_constraint(:clan_id)
    |> unique_constraint(:name, name: :character_name_unique_key)
    |> validate_required([:user_id, :name])
  end
end
