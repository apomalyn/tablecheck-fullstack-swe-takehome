require 'rails_helper'

RSpec.describe WaitlistController, type: :controller do
  let(:restaurant) { build(:restaurant, max_party_size: 4) }

  describe "POST #join" do
    let(:party) { build(:party, size: 2) }

    before :each do
      allow(Party).to receive(:new).and_return(party)
    end

    it "adds the party to the waitlist and returns OK" do
      # Mock Part.new and Restaurant.find
      allow(Party).to receive(:new).and_return(party)
      mock_restaurant_collection(restaurant)

      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { name: party.name, party_size: 2 }
      }

      expect(Party).to have_received(:new)
      expect(response).to have_http_status(:created)
      expect(response.content_type).to eq('application/json; charset=utf-8')
      expect(JSON.parse(response.body)).to include({
                                                     "uuid" => match(/[0-9a-f]{24}/),
                                                     "name" => party.name,
                                                     "size" => party.size
                                                   })
    end

    it "returns a UNPROCESSABLE when the party size exceeding restaurant limit" do
      # Mock Restaurant.find
      mock_restaurant_collection(restaurant)

      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { name: party.name, party_size: 5 }
      }

      expect(Party).to_not have_received(:new)
      expect(response).to have_http_status(:unprocessable_content)
      expect(response.content_type).to eq('application/json; charset=utf-8')
      expect(JSON.parse(response.body)).to include("message" => "Party size cannot exceed #{restaurant.max_party_size}")
    end

    it "returns a BAD_REQUEST when name is missing" do
      # Mock Restaurant.find
      mock_restaurant_collection(restaurant)

      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { party_size: 5 }
      }

      expect(Party).to_not have_received(:new)
      expect(response).to have_http_status(:bad_request)
      expect(response.content_type).to eq('application/json; charset=utf-8')
      expect(JSON.parse(response.body)).to include("message" => end_with("name"))
    end

    it "returns a BAD_REQUEST when party_size is missing" do
      # Mock Restaurant.find
      mock_restaurant_collection(restaurant)

      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { name: party.name }
      }

      expect(Party).to_not have_received(:new)
      expect(response).to have_http_status(:bad_request)
      expect(response.content_type).to eq('application/json; charset=utf-8')
      expect(JSON.parse(response.body)).to include("message" => end_with("party_size"))
    end

    it "returns a NOT_FOUND when the restaurant doesn't exist" do
      # Mock Restaurant.find to raise a Mongoid::Errors::DocumentNotFound
      allow(Restaurant).to receive(:find)
                             .and_raise(Mongoid::Errors::DocumentNotFound.new(Restaurant, [ restaurant._id ]))

      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { name: party.name, party_size: party.size }
      }

      expect(Party).to_not have_received(:new)
      expect(response).to have_http_status(:not_found)
    end
  end

  # Mock the Restaurant.find and find_by to return :restaurant
  def mock_restaurant_collection(restaurant, save_mock_response = true)
    allow(Restaurant).to receive(:find).and_return(
      double(Restaurant,
             _id: restaurant._id,
             waitlist: restaurant.waitlist,
             max_party_size: restaurant.max_party_size,
             save: save_mock_response,
             as_json: restaurant.as_json)
    )
  end
end
