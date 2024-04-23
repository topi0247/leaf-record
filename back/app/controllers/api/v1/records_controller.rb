class Api::V1::RecordsController < Api::V1::BasesController
  wrap_parameters false

  def index
    records = current_user.records.map do |record|
      {
        name: record.repository_name,
        created_at: record.created_at.strftime('%Y/%m/%d %H:%M:%S')
      }
    end

    if records
      records = records.sort_by { |record| record[:created_at] }.reverse
    end
    render json: records
  end

  def show
    repo = Github.new(current_user)
    render json: repo.get_repository_details(record_params[:repository_name])
  end

  def create
    repository_name = record_params[:repository_name]
    record = current_user.new_record(repository_name)

    res = {}
    if record
      repo = Github.new(current_user)
      res = repo.create_repository(repository_name)
      if res[:success]
        current_user.records.create(repository_name: repository_name)
      end
    else
      res = { success: false, message: 'リポジトリがすでにあります。'}
    end

    render json: res
  end

  private

  def record_params
    params.permit(:repository_name)
  end
end
