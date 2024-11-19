require 'rails_helper'

RSpec.describe WaitlistController, type: :controller do
  let(:party) { build(:party, size: 2) }
  let(:party2) { build(:party) }
  let(:restaurant) { build(:restaurant, max_party_size: 4, current_capacity: 2, waitlist: [ party ]) }

  before :each do
    allow(Restaurant).to receive(:find).and_return(restaurant)
    allow(Restaurant).to receive(:find_by).and_return(restaurant)
    allow(restaurant).to receive(:save).and_return(true)
  end

  describe "POST #join" do
    before :each do
      allow(Party).to receive(:new).and_return(party2)
    end

    it "adds the party to the waitlist and returns OK" do
      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { name: party2.name, party_size: 2 }
      }

      expect(Party).to have_received(:new)
      expect(restaurant.waitlist.length).to eq(2)
      expect(response).to have_http_status(:created)
      expect(response.content_type).to eq('application/json; charset=utf-8')
      expect(JSON.parse(response.body)).to include({
                                                     "uuid" => party2._id,
                                                     "name" => party2.name,
                                                     "size" => party2.size
                                                   })
    end

    it "returns a UNPROCESSABLE when the party size exceeding restaurant limit" do
      post :join, as: :json, params: {
        restaurant_uuid: restaurant._id,
        waitlist: { name: party.name, party_size: 5 }
      }

      expect(Party).to_not have_received(:new)
      expect(restaurant.waitlist.length).to eq(1)
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
      expect(restaurant.waitlist.length).to eq(1)
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
      expect(restaurant.waitlist.length).to eq(1)
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

  describe "POST #check_in" do
    before :each do
      allow(restaurant.waitlist).to receive(:find)
                                      .with(party._id)
                                      .and_return(party)
      allow(restaurant.waitlist).to receive(:find)
                                      .with(party2._id)
                                      .and_return(party2)
      allow(party).to receive(:destroy)
      allow(party2).to receive(:destroy)
    end

    it "should check-in the party when party is first in line and there is enough capacity" do
      post :check_in, params: { uuid: party.id }

      expect(restaurant.current_capacity).to eq(0) # current_capacity (2) - party_size (2)
      expect(party).to have_received(:destroy)
      # TODO find a way to validate the Job.set(wait: X.seconds)
      expect(RestaurantCleaningTableJob).to have_been_enqueued.with(restaurant._id, party.size)
      expect(response).to have_http_status(:ok)
    end

    it "should refuse check-in (FORBIDDEN) if there aren't enough capacity." do
      restaurant.current_capacity = 1
      post :check_in, params: { uuid: party._id }

      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)).to include("message" => "Check-in isn't available for this party yet.")
      expect(RestaurantCleaningTableJob).to_not have_been_enqueued.with(restaurant._id, party.size)
      expect(party).to_not have_received(:destroy)
      expect(restaurant.current_capacity).to eq(1)
    end

    it "should refuse check-in (FORBIDDEN) if the party isn't first in line" do
      restaurant.waitlist.push(party2)
      post :check_in, params: { uuid: party2._id }

      expect(response).to have_http_status(:forbidden)
      expect(JSON.parse(response.body)).to include("message" => "Check-in isn't available for this party yet.")
      expect(RestaurantCleaningTableJob).to_not have_been_enqueued.with(restaurant._id, party2.size)
      expect(party2).to_not have_received(:destroy)
    end
  end

  describe "DELETE #destroy" do
    it "should delete the party when found" do
      allow(restaurant.waitlist).to receive(:find)
                                      .with(party._id)
                                      .and_return(party)
      allow(party).to receive(:destroy).and_return(true)

      delete :destroy, params: { uuid: party._id }
      expect(response).to have_http_status(:no_content)
      expect(party).to have_received(:destroy)
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
