require 'spec_helper'
ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
# Prevent database truncation if the environment is production
abort("The Rails environment is running in production mode!") if Rails.env.production?
require 'rspec/rails'
# Add additional requires below this line. Rails is not loaded until this point!

RSpec.configure do |config|
  config.include FactoryBot::Syntax::Methods
  config.include Mongoid::Matchers, type: :model

  # Remove this line to enable support for ActiveRecord
  config.use_active_record = false

  # Filter lines from Rails gems in backtraces.
  config.filter_rails_from_backtrace!
end
