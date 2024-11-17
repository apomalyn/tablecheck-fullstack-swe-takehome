class ApplicationController < ActionController::API
  rescue_from "ActionController::ParameterMissing" do |exception|
    render json: { message: "Request is missing one or multiple parameters." }, status: :bad_request
  end

  rescue_from "Mongoid::Errors::DocumentNotFound" do |exception|
    render status: :not_found
  end
end
