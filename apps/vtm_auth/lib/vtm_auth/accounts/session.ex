defmodule VtmAuth.Accounts.Session do
  @moduledoc false

  use Ecto.Schema
  import Ecto.Changeset

  alias VtmAuth.Accounts.User

  @type t :: %__MODULE__{
    last_checked: NaiveDateTime.t(),
    remember: boolean(),
    host: binary(),
    ip: binary(),
    session_info: map(),
    completed: boolean(),
    visible: boolean(),

    inserted_at: NaiveDateTime.t(),
    updated_at: NaiveDateTime.t()
  }

  schema "sessions" do
    field :last_checked, :naive_datetime
    field :remember, :boolean
    field :host, :string
    field :ip, :string
    field :session_info, :map
    field :completed, :boolean
    field :visible, :boolean

    belongs_to :user, User

    timestamps()
  end

  @doc false
  def changeset(session, attrs) do
    session
    |> cast(attrs, [:user_id, :last_checked, :remember, :host, :ip, :session_info, :completed, :visible])
    |> unique_constraint([:user_id], name: "session_user_unique_idx")
    |> validate_required([:last_checked, :user_id])
  end
end
