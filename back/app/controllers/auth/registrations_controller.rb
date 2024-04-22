class Auth::RegistrationsController < DeviseTokenAuth::RegistrationsController
  def sign_up_params
    params.require(:registration).permit(:uid,:name)
  end
end