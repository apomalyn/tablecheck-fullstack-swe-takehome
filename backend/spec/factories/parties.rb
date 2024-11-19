FactoryBot.define do
  factory :party do
    _id { Faker::Internet.uuid }
    name { Faker::Name.name }
    size { Faker::Number.between(from: 1, to: 10) }
    expires_on { Time.now + 1.day }
  end
end
