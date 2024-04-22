class Auth::SessionsController < DeviseTokenAuth::SessionsController
  wrap_parameters false

  def destroy
    Rails.logger.debug("============================================")
    Rails.logger.debug("destroy")
  end

  def resource_name
    :user
  end
end