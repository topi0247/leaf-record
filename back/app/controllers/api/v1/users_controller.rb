class Api::V1::UsersController < Api::V1::BasesController
  def me
    if current_user
      render json: { success: true, user: {id: current_user.id, name: current_user.name} }
    else
      render json: { success: false, message: 'User not found' }
    end
  end
end
