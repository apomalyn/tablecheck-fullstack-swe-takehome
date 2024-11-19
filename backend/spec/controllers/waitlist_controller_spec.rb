require 'rails_helper'

RSpec.describe WaitlistController, type: :controller do
  let(:party) { build(:party, size: 2) }
  let(:restaurant) { build(:restaurant, max_party_size: 4, waitlist: [ party ]) }
  let(:double_restaurant) {
    double(Restaurant,
           _id: restaurant._id,
           waitlist: restaurant.waitlist,
           max_party_size: restaurant.max_party_size,
           save: true,
           as_json: restaurant.as_json)
  }

  before :each do
    allow(Restaurant).to receive(:find).and_return(double_restaurant)
    allow(Restaurant).to receive(:find_by).and_return(double_restaurant)
  end

  describe "POST #join" do
    before :each do
      allow(Party).to receive(:new).and_return(party)
    end

    it "adds the party to the waitlist and returns OK" do
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
      allow(Restaurant).to receive(:find).with("000")
                                         .and_raise(Mongoid::Errors::DocumentNotFound.new(Restaurant, [ restaurant._id ]))

      post :join, as: :json, params: {
        restaurant_uuid: "000",
        waitlist: { name: party.name, party_size: party.size }
      }

      expect(Party).to_not have_received(:new)
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE #destroy" do
    it "should delete the party when found" do
      double_party = double(Party,
             _id: party._id,
             destroy: true)
      allow(restaurant.waitlist).to receive(:find)
                                      .with(party._id)
                                      .and_return(double_party)

      delete :destroy, params: { uuid: party._id }
      expect(response).to have_http_status(:no_content)
      expect(double_party).to have_received(:destroy)
    end

    it "should return NOT_FOUND when party doesn't exist" do
      allow(restaurant.waitlist).to receive(:find)
                                      .with(party._id)
                                      .and_raise(Mongoid::Errors::DocumentNotFound.new(Party, [ party._id ]))

      delete :destroy, params: { uuid: party._id }

      expect(response).to have_http_status(:not_found)
    end
  end
end
