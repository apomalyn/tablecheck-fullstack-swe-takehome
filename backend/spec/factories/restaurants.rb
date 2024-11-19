FactoryBot.define do
  factory :restaurant do
    _id { Faker::Internet.uuid.delete("-") }
    name { Faker::Restaurant.name }
    capacity { Faker::Number.between(from: 1, to: 100) }
    current_capacity { capacity }
    max_party_size { capacity }
  end
end
