FactoryBot.define do
  factory :party do
    _id { Faker::Internet.uuid.delete("-") }
    name { Faker::Name.name }
    size { Faker::Number.between(from: 1, to: 10) }
    expires_on { DateTime.now + 1.day }
    restaurant { build(:restaurant) }
  end
end
