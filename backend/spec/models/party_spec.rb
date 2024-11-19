require 'rails_helper'

RSpec.describe Party, type: :model do
  describe 'validations' do
    it 'is valid with valid attributes' do
      party = build(:party)
      expect(party).to be_valid
    end

    it 'is invalid without a name' do
      party = build(:party, name: nil)
      expect(party).not_to be_valid
    end

    it 'is invalid with a name shorter than 1 character' do
      party = build(:party, name: '')
      expect(party).not_to be_valid
    end

    it 'is invalid without a size' do
      party = build(:party, size: nil)
      expect(party).not_to be_valid
    end

    it 'is invalid with a size less than 1' do
      party = build(:party, size: 0)
      expect(party).not_to be_valid
    end
  end

  describe 'DB' do
    it { is_expected.to be_mongoid_document }
    it { is_expected.to have_field(:name).of_type(String) }
    it { is_expected.to have_field(:created_at).of_type(Time) } # equivalent of Timestamps::Created
    it { is_expected.to have_field(:size).of_type(Integer) }
    it { is_expected.to have_field(:expires_on).of_type(DateTime) }
    it { is_expected.to be_embedded_in(:restaurant).of_type(Restaurant) }
  end

  describe '#as_json' do
    it 'returns a JSON representation' do
      party = build(:party, name: 'Test Party', size: 4)
      json = party.as_json

      expect(json).to eq({
                           uuid: party._id,
                           name: 'Test Party',
                           size: 4,
                           expires_on: party.expires_on
                         })
    end
  end
end
