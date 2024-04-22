class Api::V1::RecordsController < Api::V1::BasesController
  wrap_parameters false

  def index
    records = current_user.records.order(created_at: :desc)
    render json: records.map{|record| {id: record.id, name: record.repository_name, created_at: record.created_at.strftime("%Y-%m-%d %H:%M:%S")}}
  end

  def show
    repo = Github.new(current_user)
    render json: repo.get_repository_details(record_params[:repository_name])
  end

  def create
    current_user.reload
    repo = Github.new(current_user)
    if repo.create_repository(record_params[:repository_name])
      render json: { success: true }
    else
      render json: { success: false }
    end
  end

  private

  def record_params
    params.permit(:repository_name)
  end
end
