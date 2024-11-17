class ApplicationController < ActionController::API
  rescue_from "ActionController::ParameterMissing" do |exception|
    render json: { message: "Request is missing one or multiple parameters." }, status: :bad_request
  end
end
