# rubocop:todo all
Mongoid.configure do
  target_version = "9.0"

  # Load Mongoid behavior defaults. This automatically sets
  # features flags (refer to documentation)
  config.load_defaults target_version
end
