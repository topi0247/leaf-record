class Api::V1::BasesController < ApplicationController
  wrap_parameters false
  include DeviseTokenAuth::Concerns::SetUserByToken
  before_action :authenticate_user!

  protected

  def resource_name
    :user
  end
end