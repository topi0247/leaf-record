class Api::V1::RecordsController < Api::V1::BasesController
  wrap_parameters false

  def index
    records = current_user.records.map do |record|
      {
        name: record.repository_name,
        created_at: record.created_at.strftime('%Y/%m/%d %H:%M:%S')
      }
    end

    records = records.sort_by { |record| record[:created_at] }.reverse
    render json: records, status: :ok
  end

  def show
    repo = set_repository

    repository_name = record_params[:id]
    unless repo.repository_exists?(repository_name)
      record = Record.find_by(repository_name: repository_name)
      if record
        record.destroy
      end

      render json: { success: false, message: 'リポジトリがありません' }
      return
    end

    render json: { success: true, files: repo.get_all_files(repository_name)}, status: :ok
  end

  def create
    repository_name = record_params[:repository_name]
    record = current_user.new_record(repository_name)

    res = {}
    if record
      repo = set_repository
      res = repo.create_repository(repository_name)
      if res[:success]
        record.save
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

    # レコードのDBに保存されていないリポジトリの削除を防止
    if current_user.records.find_by(repository_name: repository_name).nil?
      render json: { success: false, message: '記録集にデータがありません' }
      return
    end

    repo = set_repository

    repo_update = repo.update_multiple_files(repository_name, record_params[:files], DateTime.now.strftime('%Y/%m/%d %H:%M:%S'))
    # repo_update = repo.commit_push(repository_name, DateTime.now.strftime('%Y/%m/%d %H:%M:%S'),record_params[:files])

    render json: repo_update, state: :ok
  end

  private

  def record_params
    params.permit(:id, :repository_name, files: [:name, :content, :path])
  end

  def set_repository
    Github.new(current_user)
  end
end
