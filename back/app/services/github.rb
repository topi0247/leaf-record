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

  def get_repository_details(name)
    repository = @client.repository(name)
    contents = get_contents_recursive(name)
    {
      name: repository.name,
      owner: repository.owner.login,
      files: contents.select { |content| content.type == 'file' }.map { |file| file.name },
      folders: contents.select { |content| content.type == 'dir' }.map { |folder| folder.name },
      file_contents: contents.select { |content| content.type == 'file' }.map { |file| Base64.decode64(@client.contents(name, path: file.path).content) }
    }
  end

  def get_contents_recursive(repo, path = '')
    contents = @client.contents(repo, path: path)
    contents.each_with_object([]) do |content, all_contents|
      all_contents << content
      if content.type == 'dir'
        all_contents.concat(get_contents_recursive(repo, content.path))
      end
    end
  end
end
