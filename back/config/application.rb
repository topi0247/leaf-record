require_relative "boot"

require "rails/all"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module App
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    # Common ones are `templates`, `generators`, or `middleware`, for example.
    config.autoload_lib(ignore: %w(assets tasks))

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true

    config.generators do |g|
      g.skip_routes true
      g.helper false
      g.test_framework nil
    end

    # クッキーを使うため
    config.middleware.use ActionDispatch::Cookies
    # セッションを使うため
    config.middleware.use ActionDispatch::Session::CookieStore, key: ENV['SESSION_STORE_KEY']
    # クロスサイト時に必要な設定、ドメインが異なっても使えるようにする
    config.action_dispatch.cookies_same_site_protection = :none


    # タイムゾーンを日本時間に設定
    config.time_zone = 'Tokyo'
    config.active_record.default_timezone = :local
  end
end
