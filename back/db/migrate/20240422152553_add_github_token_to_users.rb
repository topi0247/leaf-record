class AddGithubTokenToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :github_token, :json, null: false, default: ''
  end
end
