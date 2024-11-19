require 'rails_helper'

RSpec.describe Restaurant, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      restaurant = build(:restaurant)
      expect(restaurant).to be_valid
    end

    it 'is invalid without a name' do
      restaurant = build(:restaurant, name: nil)
      expect(restaurant).not_to be_valid
    end

    it 'is invalid with a negative capacity' do
      restaurant = build(:restaurant, capacity: -1)
      expect(restaurant).not_to be_valid
    end

    it 'is invalid with a negative max_party_size' do
      restaurant = build(:restaurant, max_party_size: -1)
      expect(restaurant).not_to be_valid
    end

    it 'is invalid with a max_party_size greater than capacity' do
      restaurant = build(:restaurant, capacity: 10, max_party_size: 11)
      expect(restaurant).not_to be_valid
    end
  end

  describe 'DB' do
    it { is_expected.to have_timestamps }
    it { is_expected.to be_mongoid_document }
    it { is_expected.to have_fields(:capacity, :current_capacity, :max_party_size).of_type(Integer) }
    it { is_expected.to embed_many(:waitlist) }
  end

  describe 'default values' do
    it 'sets the max_party_size to capacity by default' do
      capacity = Faker::Number.between(from: 1, to: 100)
      restaurant = Restaurant.new(name: "Test", capacity: capacity)
      expect(restaurant.max_party_size).to eq(capacity)
    end

    it 'sets the current_capacity to capacity by default' do
      capacity = Faker::Number.between(from: 1, to: 100)
      restaurant = Restaurant.new(name: "Test", capacity: capacity)
      expect(restaurant.current_capacity).to eq(capacity)
      restaurant._id.to_bson_normalized_value
    end
  end

  describe 'as_json' do
    it 'returns a JSON representation' do
      restaurant = build(:restaurant, name: 'Test Restaurant', capacity: 100)
      json = restaurant.as_json

      expect(json).to eq({
                           uuid: restaurant._id,
                           name: 'Test Restaurant',
                           capacity: 100,
                           current_capacity: 100,
                           max_party_size: 100
                         })
    end
  end
end
