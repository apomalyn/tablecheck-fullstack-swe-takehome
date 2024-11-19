require "rails_helper"

RSpec.describe RestaurantsController, type: :routing do
  describe "routing" do
    it "routes to #show" do
      expect(get: "/restaurants/1").to route_to("restaurants#show", uuid: "1")
    end

    it "routes to #create" do
      expect(post: "/restaurants").to route_to("restaurants#create")
    end
  end
end
