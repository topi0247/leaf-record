require 'octokit'

class Github
  def initialize(current_user)
    @current_user = current_user
    github_token = @current_user.github_token
    decrypted = Decryptor.decrypt(github_token)
    @client = Octokit::Client.new(access_token: decrypted)
  end

  def create_repository(name)
    if @client.create_repository(name, { private: true })
      @current_user.records.create(repository_name: name)
      true
    else
      false
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
