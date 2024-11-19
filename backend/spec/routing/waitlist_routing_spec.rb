require "rails_helper"

RSpec.describe WaitlistController, type: :routing do
  describe 'routing' do
    it 'routes to #join' do
      expect(post: "/waitlist/1/join").to route_to("waitlist#join", restaurant_uuid: "1")
    end

    it 'routes to #position_stream' do
      expect(get: "/waitlist/1").to route_to("waitlist#position_stream", uuid: "1")
    end

    it 'routes to #check_in' do
      expect(post: "/waitlist/1/check-in").to route_to("waitlist#check_in", uuid: "1")
    end

    it 'routes to #destroy' do
      expect(delete: "/waitlist/1").to route_to("waitlist#destroy", uuid: "1")
    end
  end
end
