class Party
  include Mongoid::Document
  include Mongoid::Timestamps::Created
  attr_readonly :_id, type: String, default: -> { SecureRandom.uuid }
  embedded_in :restaurant, class_name: "Restaurant"
  field :name, type: String
  field :size, type: Integer
  alias_attribute :party_size, :size
  field :expires_on, type: DateTime, default: -> { Time.now + 1.day }

  validates :name, presence: true, length: { minimum: 1 }
  validates :size, presence: true, comparison: { greater_than_or_equal_to: 1 }

  def as_json(options = {})
    {
      uuid: _id,
      name: name,
      size: size,
      expires_on: expires_on
    }
  end
end
