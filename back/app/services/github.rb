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
    return [] if repository_empty?(repo_name)

    repository_name = set_repository_name(repo_name)
    head_sha = @client.ref(repository_name, 'heads/main').object.sha

    # ディレクトリ再帰巡回の代わりに Trees API で全パスを1回のAPIコールで取得
    tree = @client.tree(repository_name, head_sha, recursive: true)
    file_blobs = tree.tree.select { |item| item.type == 'blob' }

    # 各ファイルのコンテンツ取得を並列実行
    futures = file_blobs.map do |blob|
      Concurrent::Future.execute do
        content = @client.blob(repository_name, blob.sha)
        decoded = Base64.decode64(content.content.gsub(/\s+/, ''))
        { name: File.basename(blob.path), path: blob.path, content: decoded }
      end
    end

    @remote_files = futures.map(&:value!)
  rescue Octokit::Error => e
    Rails.logger.error e
    []
  end

  def commit_push(repo_name, files, commitMessage)
    repository_name = set_repository_name(repo_name)
    branch = 'main'

    base_tree = @client.ref(repository_name, "heads/#{branch}").object.sha

    # blob作成を並列実行
    futures = files.map do |file|
      Concurrent::Future.execute do
        if file[:is_delete]
          delete_file(file[:path])
        elsif file[:path] == file[:old_path] || file[:old_path].empty?
          create_or_update_file(repository_name, file)
        else
          [delete_file(file[:old_path]), create_or_update_file(repository_name, file)]
        end
      end
    end

    blobs = futures.map(&:value!).flatten

    new_tree = @client.create_tree(repository_name, blobs, base_tree: base_tree)
    new_commit = @client.create_commit(repository_name, commitMessage, new_tree.sha, base_tree)
    @client.update_ref(repository_name, "heads/#{branch}", new_commit.sha)
  rescue Octokit::Error => e
    Rails.logger.error e
    { success: false, message: 'コミットに失敗しました'}
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

  def exist_file_update(repo_name, files)
    return [] if files.nil? || files.empty?

    error = []
    files.each do |file|
      begin
        content = file[:content].presence || ''
        next if @remote_files.any? { |f| f[:name] == file[:name] && f[:content] == content }

        file_contents = @client.contents(set_repository_name(repo_name), path: file[:name])
        sha = file_contents.sha
        @client.update_contents(set_repository_name(repo_name), file[:name], "更新 #{@commitMessage}", sha, content)
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
        content = file[:content] || ''
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

  def delete_file(old_path)
    {
      path: old_path,
      mode: '100644',
      type: 'blob',
      sha: nil
    }
  end

  def create_or_update_file(repository_name, file)
    {
      path: file[:path],
      mode: '100644',
      type: 'blob',
      sha: @client.create_blob(repository_name, file[:content])
    }
  end
end
