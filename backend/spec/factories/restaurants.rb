FactoryBot.define do
  factory :restaurant do
    _id { "673b6c7259939e4377f7398c" }
    name { Faker::Restaurant.name }
    capacity { Faker::Number.between(from: 1, to: 100) }
    current_capacity { capacity }
    max_party_size { capacity }
  end
end
