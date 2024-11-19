require 'rails_helper'

RSpec.describe RestaurantsController, type: :controller do
  let!(:restaurant) { build(:restaurant) }

  describe "GET #show" do
    it "should return the restaurant when it exist" do
      # Mock DB response
      allow(Restaurant).to receive(:find).and_return(restaurant)

      get :show, params: { uuid: restaurant._id }

      # Validate status, content-type and body content
      expect(response).to have_http_status(:ok)
      expect(response.content_type).to start_with("application/json")
      expect_restaurant_json_match(response.body, restaurant)

    end

    it "should return a 404 (Not Found) with nothing when the restaurant doesn't exist" do
      # Mock Restaurant.find to throw Errors::DocumentNotFound
      allow(Restaurant).to receive(:find).and_raise(Mongoid::Errors::DocumentNotFound.new(Restaurant, "123123123"))

      get :show, params: { uuid: "123123123" }

      # Validate status
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "POST #create" do
    context "Happy path" do
      it "should create and return the restaurant when only the required parameters are passed" do
        mock_restaurant_collection(restaurant)
        post :create, as: :json, params: {
          restaurant: { name: restaurant.name, capacity: restaurant.capacity }
        }

        expect(response).to have_http_status(:created)
        expect_restaurant_json_match(response.body, restaurant)

      end

      it "should accept max_party_size" do
        sample = build(:restaurant, max_party_size: 5)
        mock_restaurant_collection(sample)

        post :create, as: :json, params: {
          restaurant: { name: sample.name, capacity: sample.capacity, max_party_size: sample.max_party_size }
        }

        expect(response).to have_http_status(:created)
        expect_restaurant_json_match(response.body, sample, true)
      end

      def mock_restaurant_collection(restaurant)
        # Mock the database and save method
        allow(Restaurant).to receive(:new).and_return(restaurant)
        allow(restaurant).to receive(:save).and_return(true)
      end
    end

    context "with invalid params" do
      it "should refuse a request with no parameters" do
        post :create, as: :json, params: { restaurant: {} }

        expect(response).to have_http_status(:bad_request)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(JSON.parse(response.body)).to include("message")
      end

      it "should refuse a request when missing capacity" do
        post :create, as: :json, params: { restaurant: { name: restaurant.name } }

        expect(response).to have_http_status(:bad_request)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(JSON.parse(response.body)).to include("message" => end_with("capacity"))
      end

      it "should refuse a request when missing name" do
        post :create, as: :json, params: { restaurant: { capacity: restaurant.capacity } }

        expect(response).to have_http_status(:bad_request)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(JSON.parse(response.body)).to include("message" => end_with("name"))
      end

      it "should refuse a request when a capacity isn't a integer" do
        post :create, as: :json, params: { restaurant: { name: restaurant.name, capacity: "error" } }

        expect(response).to have_http_status(:unprocessable_content)
        expect(response.content_type).to eq('application/json; charset=utf-8')
        expect(JSON.parse(response.body)).to include("errors" => include("capacity"))
      end
    end
  end

  def expect_restaurant_json_match(body, restaurant, match_uuid = false)
    expect(JSON.parse(body)).to include(
                                  "uuid" => match_uuid ? match(/[0-9a-f]{24}/) : restaurant._id,
                                  "name" => restaurant.name,
                                  "capacity" => restaurant.capacity,
                                  "current_capacity" => restaurant.current_capacity,
                                  "max_party_size" => restaurant.max_party_size
                                )
  end
end
