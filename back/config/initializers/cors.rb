Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV["FRONT_URL"] || "http://localhost:8000"

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
