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

    get_all_files_recursive("#{@current_user.name}/#{repo_name}").flatten
  end

  def update_multiple_files(repository, files, message)
    files.each do |file, content|
      begin
        @client.update_contents(repository, file, message, content)
      rescue Octokit::Error => e
        return { success: false, message: "Failed to update file: #{file}" }
      end
    end
    { success: true, message: 'Updated files successfully' }
  end

  private

  def is_repository_empty?(repo_name)
    @client.contents("#{@current_user.name}/#{repo_name}")
    false
  rescue Octokit::NotFound
    true
  end

  def get_all_files_recursive(repo_name, path = '')
    Rails.logger.debug("repo_name: #{repo_name}, path: #{path}")
    contents = @client.contents(repo_name, path: path)

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
end
