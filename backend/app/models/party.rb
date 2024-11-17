class Party
  include Mongoid::Document
  attr_readonly :_id, type: String, default: -> { SecureRandom.uuid }
  embedded_in :restaurant, class_name: "Restaurant"
  field :name, type: String
  field :size, type: Integer
  alias_attribute :party_size, :size
  field :created_on, type: DateTime, default: -> { DateTime.now }
  field :expires_on, type: DateTime, default: -> { DateTime.tomorrow }
end
