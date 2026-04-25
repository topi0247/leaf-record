class ApplicationController < ActionController::API
  include ActionController::Cookies
  include DeviseTokenAuth::Concerns::SetUserByToken
  prepend_before_action :set_auth_headers_from_cookies

  private

  def set_auth_headers_from_cookies
    request.headers['access-token'] ||= request.cookies['access-token']
    request.headers['client']       ||= request.cookies['client']
    request.headers['uid']          ||= request.cookies['uid']
    request.headers['expiry']       ||= request.cookies['expiry']
  end
end
