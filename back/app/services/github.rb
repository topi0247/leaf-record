require 'octokit'

class Github
  def initialize(current_user)
    @current_user = current_user
    github_token = @current_user.github_token
    decrypted = Decryptor.decrypt(github_token)
    @client = Octokit::Client.new(access_token: decrypted)
  end

  def get_repositories
    @client.repositories(sort: 'created', direction: 'desc').map do |repository|
      {
        name: repository.name,
        description: repository.description,
        private: repository.private,
        created_at: repository.created_at.strftime('%Y/%m/%d %H:%M:%S')
      }
    end
  end

  def create_repository(name)
    begin
      if @client.create_repository(name, { private: true })
        { success: true, message: 'リポジトリを作成しました'}
      else
        { success: false, message: 'リポジトリの作成に失敗しました'}
      end
    rescue Octokit::Error => e
      if e.message.to_s.include?('name already exists on this account')
        { success: false, message: 'リポジトリ名が既に存在しています'}
      else
        { success: false, message: 'リポジトリの作成に失敗しました'}
      end
    end
  end

  def get_all_files(repo_name)
    return [] if is_repository_empty?(repo_name)

    get_all_files_recursive(repo_name).flatten
  end

  def update_multiple_files(repo_name, files, commitMessage)
    @commitMessage = commitMessage
    all_files = get_all_files(repo_name)
    error = []

    # 既存ファイルの更新
    exits_files = files.map { |file|
      all_files.find { |f| f[:name] == file[:name] }
    }
    # error << exit_file_update(repo_name, exits_files)

    # 新規ファイルの作成
    new_files = files.reject { |file| all_files.any? { |f| f[:name] == file[:name] } }
    error << new_file_create(repo_name, new_files).flatten

    # ファイルの削除
    #delete_files = all_files.select { |file| !files.include?(file['name']) }
    #error << file_delete(repo_name, delete_files)

    if error.length > 0
      { success: false, message: error}
    else
      { success: true, message: '保存が完了しました' }
    end
  end

  private

  def set_repository_name(name)
    "#{@current_user.name}/#{name}"
  end

  def is_repository_empty?(repo_name)
    @client.contents(set_repository_name(repo_name))
    false
  rescue Octokit::NotFound
    true
  end

  def get_all_files_recursive(repo_name, path = '')
    contents = @client.contents(set_repository_name(repo_name), path: path)

    files = []

    contents.each do |content|
      if content.type == 'file'
        files << { name: content.name, path: content.path, content: content.content }
      elsif content.type == 'dir'
        files << get_all_files_recursive(repo_name, content.path)
      end
    end

    files
  end

  def exit_file_update(repo_name, files)
    return [] if files == [] || files.nil?

    error = []

    # 既存ファイルの更新
    files.each do |file|
      begin
        content = file[:content].presence
        content = Base64.encode64(content) if content
        file_contents = @client.contents(set_repository_name(repo_name), path: file[:name])

        sha = file_contents[:sha]
        options = { content: content }.compact
        @client.update_contents(set_repository_name(repo_name), file[:name], @commitMessage, sha, options)
      rescue Octokit::Error => e
        Rails.logger.error e
        error << "#{file[:name]} の更新に失敗しました"
      end
    end

    error
  end

  def new_file_create(repo_name, files)
    return [] if files.empty?

    error = []
    files.each do |file|
      begin
        content = file[:content] || ''  # 空の内容でも許容する
        options = { content: content }
        @client.create_contents(set_repository_name(repo_name), file[:name], @commitMessage, content)
      rescue Octokit::Error => e
        Rails.logger.error e
        error << "#{file[:name]} の作成に失敗しました"
      end
    end
    error
  end

  def file_delete(repo_name, files)
    Rails.logger.info "削除ファイル: #{files}"
    return [] if files == [] || files.nil?

    error = []
    files.each do |file|
      begin
        constnt = file['content'] || ''
        file_contents = @client.contents(set_repository_name(repo_name), path: file['name'])

        if file_contents.is_a?(Array)
          Rails.logger.info "【削除】#{file['name']} ディレクトリです、スキップします..."
          next
        end

        sha = file_contents.sha.to_s
        @client.delete_contents(set_repository_name(repo_name), file['name'], @commitMessage, sha)
      rescue Octokit::Error => e
        error << "#{file[:name]} の削除に失敗しました"
      end
    end
    error
  end
end
