=begin

The version of the OpenAPI document: 1.0.0
Generated by: https://github.com/openapitools/openapi-generator.git

=end

Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Restaurants
  get "restaurants/:uuid" => "restaurants#show"
  post "restaurants" => "restaurants#create"

  # Waitlist
  post "waitlist/:restaurant_uuid/join" => "waitlist#join"
  get "waitlist/:uuid" => "waitlist#show"
  post "waitlist/:uuid/check-in" => "waitlist#check_in"
  delete "waitlist/:uuid" => "waitlist#destroy"
end
