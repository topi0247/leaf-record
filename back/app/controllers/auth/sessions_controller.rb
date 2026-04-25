class Auth::SessionsController < DeviseTokenAuth::SessionsController

  def destroy
    super
    cookies.delete('access-token')
    cookies.delete('client')
    cookies.delete('uid')
    cookies.delete('expiry')
  end
end