class Restaurant
  include Mongoid::Document
  include Mongoid::Timestamps
  attr_readonly :_id, type: String, default: -> { SecureRandom.uuid }
  field :name, type: String
  field :capacity, type: Integer
  field :current_capacity, type: Integer, default: -> { self.capacity }
  field :max_party_size, type: Integer, default: -> { self.capacity }

  def as_json(options = {})
    {
      :uuid => _id,
      :name => name,
      :capacity => capacity,
      :current_capacity => current_capacity,
      :max_party_size => max_party_size
    }
  end
end
