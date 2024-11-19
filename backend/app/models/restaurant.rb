class Restaurant
  include Mongoid::Document
  include Mongoid::Timestamps
  attr_readonly :_id, type: String, default: -> { SecureRandom.uuid }
  field :name, type: String
  field :capacity, type: Integer
  field :current_capacity, type: Integer, default: -> { self.capacity }
  field :max_party_size, type: Integer, default: -> { self.capacity }
  embeds_many :waitlist, class_name: "Party"

  validates :name, presence: true, length: { minimum: 1 }
  validates :capacity, presence: true, comparison: { greater_than_or_equal_to: 1 }

  validates_each :current_capacity, :max_party_size do |record, attr, value|
    if value.nil? || value <= 0
      record.errors.add attr, "must be greater than 0 or nil"
    elsif value > record.capacity
      record.errors.add attr, "must be less than or equal to the restaurant's capacity or nil"
    end
  end

  def as_json(options = {})
    {
      uuid: _id,
      name: name,
      capacity: capacity,
      current_capacity: current_capacity,
      max_party_size: max_party_size
    }
  end
end
