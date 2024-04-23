class Api::V1::RecordsController < Api::V1::BasesController

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
    render json: records, status: :ok
  end

  def show
    repo = set_repository
    render json: repo.get_all_files(record_params[:id])
  end

  def create
    repository_name = record_params[:repository_name]
    record = current_user.new_record(repository_name)

    res = {}
    if record
      repo = set_repository
      res = repo.create_repository(repository_name)
      if res[:success]
        current_user.records.create(repository_name: repository_name)
      end
    else
      res = { success: false, message: 'リポジトリがすでにあります。'}
    end

    render json: res, status: :ok
  end

  def update
    if record_params[:files].nil?
      render json: { success: false, message: 'ファイルがありません' }
      return
    end

    repository_name = record_params[:id]
    repo = set_repository

    repo_update = repo.update_multiple_files(repository_name, record_params[:files], Date.today.strftime('%Y/%m/%d %H:%M:%S'))

    render json: repo_update, state: :ok
  end

  private

  def record_params
    params.permit(:id, files: [:name, :content, :path])
  end

  def set_repository
    Github.new(current_user)
  end
end
