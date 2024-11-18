=begin

Job used to clean the tables after the customers. When executed the restaurant gets X seats back.
It's recommended to use .set(wait_until) to set precisely when the job will be executed.

=end

class RestaurantCleaningTableJob < ApplicationJob
  queue_as :serving

  def perform(restaurant_uuid, party_size)
    restaurant = Restaurant.find(restaurant_uuid)
    restaurant.current_capacity += party_size
    restaurant.save
    puts "#{party_size} seats are free."
  end
end
