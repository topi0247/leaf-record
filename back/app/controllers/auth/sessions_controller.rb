class Auth::SessionsController < DeviseTokenAuth::SessionsController

  def destroy
    super
  end
end