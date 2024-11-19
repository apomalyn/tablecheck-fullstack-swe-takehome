class RestaurantsController < ApplicationController
  before_action :set_restaurant, only: [ :show ]

  # GET /restaurants/1
  def show
    render json: @restaurant
  end

  # Create a new restaurant.
  # For now, this endpoint isn't secured meaning that anyone
  # can create a new restaurant. This will be fixed in the future.
  def create
    @restaurant = Restaurant.new(restaurant_params)

    if @restaurant.save
      render json: @restaurant, status: :created
    else
      # Remove :current_capacity as it isn't an accepted parameter
      @restaurant.errors.delete(:current_capacity)
      render json: {
        message: "Creation failed.",
        errors: @restaurant.errors
      }, status: :unprocessable_content
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_restaurant
    @restaurant = Restaurant.find(params.expect(:uuid))
  end

  # Only allow a list of trusted parameters through.
  def restaurant_params
    restaurant_params = params.expect(restaurant: [ :name, :capacity, :max_party_size ]).except([ :current_capacity ])
    if restaurant_params[:name].blank? and restaurant_params[:capacity].blank?
      raise ActionController::ParameterMissing
    end
    restaurant_params
  end
end
