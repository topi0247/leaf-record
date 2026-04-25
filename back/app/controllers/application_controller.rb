class ApplicationController < ActionController::API
  include ActionController::Cookies
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :set_auth_headers_from_cookies

  private

  def set_auth_headers_from_cookies
    request.headers['access-token'] ||= cookies['access-token']
    request.headers['client']       ||= cookies['client']
    request.headers['uid']          ||= cookies['uid']
    request.headers['expiry']       ||= cookies['expiry']
  end
end
