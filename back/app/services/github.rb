require 'octokit'

class Github
  def initialize(current_user)
    @current_user = current_user
    github_token = @current_user.github_token
    decrypted = Decryptor.decrypt(github_token)
    @client = Octokit::Client.new(access_token: decrypted)
  end

  def repository_exists?(repo_name)
    @client.repository(set_repository_name(repo_name))
    true
  rescue Octokit::NotFound
    false
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
        @client.create_contents(set_repository_name(name), 'README.md', 'Initial commit', '# 記録を自由に書いてみよう！')
        { success: true, message: 'リポジトリを作成しました'}
      else
        { success: false, message: 'リポジトリの作成に失敗しました'}
      end
    rescue Octokit::Error => e
      Rails.logger.error e
      if e.message.to_s.include?('name already exists on this account')
        { success: false, message: 'リポジトリ名が既に存在しています'}
      else
        { success: false, message: 'リポジトリの作成に失敗しました'}
      end
    end
  end

  def get_all_files(repo_name)
    return [] unless repository_exists?(repo_name)

    @remote_files = get_all_files_recursive(repo_name).flatten
    @remote_files
  end

  def commit_push(repo_name, files, commitMessage)
    repository_name = set_repository_name(repo_name)
    branch = 'main'

    begin
      # 現在のツリーを取得
      base_tree = @client.ref(repository_name, "heads/#{branch}").object.sha
      # ベースコミットを取得
      base_commit = @client.commit(repository_name, base_tree)

      update_files = files.map do |file|
        {
          path: file[:path],
          mode: '100644',
          type: 'blob',
          content: file[:content]
        }
      end

      # 新しいツリーを作成
      new_tree = @client.create_tree(repository_name, update_files, base_tree: base_tree)

      # 新しいコミットを作成
      new_commit = @client.create_commit(repository_name, commitMessage, new_tree.sha, base_commit.sha)

      # リモートリポジトリにプッシュ
      @client.update_ref(repository_name, "heads/#{branch}", new_commit.sha)
    rescue Octokit::Error => e
      Rails.logger.error e
      { success: false, message: 'コミットに失敗しました'}
    end
  end

  private

  def set_repository_name(name)
    "#{@current_user.name}/#{name}"
  end

  def repository_empty?(repo_name)
    @client.contents(set_repository_name(repo_name)).empty?
  rescue Octokit::NotFound
    true
  end

  def get_all_files_recursive(repo_name, path = '')
    return [] if repository_empty?(repo_name)
    contents = @client.contents(set_repository_name(repo_name), path: path)

    files = []

    contents.each do |content|
      if content.type == 'file'
        file_contents = @client.contents(set_repository_name(repo_name), path: content.path)
        files << { name: content.name, path: content.path, content: Base64.decode64(file_contents.content) }
      elsif content.type == 'dir'
        files << get_all_files_recursive(repo_name, content.path)
      end
    end

    files
  end

  def exist_file_update(repo_name, files)
    return [] if files.nil? || files.empty?

    error = []
    files.each do |file|
      begin
        # contentがnilだとエラーが発生するので空文字を代入
        content = file[:content].presence || ''

        # contentとリモートリポジトリのファイル内容が同じ場合は更新しない
        next if @remote_files.any? { |f| f[:name] == file[:name] && f[:content] == content }

        file_contents = @client.contents(set_repository_name(repo_name), path: file[:name])

        sha = file_contents.sha
        @client.update_contents(set_repository_name(repo_name), file[:name], "更新 #{@commitMessage}", sha,content)
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
        @client.create_contents(set_repository_name(repo_name), file[:name], "作成 #{@commitMessage}", content)
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
        file_contents = @client.contents(set_repository_name(repo_name), path: file[:name])

        # ファイルが存在しない場合はスキップ
        next if file_contents.nil?

        sha = file_contents.sha
        @client.delete_contents(set_repository_name(repo_name), file[:name], "削除 #{@commitMessage}", sha)
      rescue Octokit::Error => e
        Rails.logger.error e
        error << "#{file[:name]} の削除に失敗しました"
      end
    end
    error
  end
end
