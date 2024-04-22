class DeviseTokenAuthCreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table(:users) do |t|

      ## Token authenticatable
      t.string :authentication_token

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string :current_sign_in_ip
      t.string :last_sign_in_ip

      ## Confirmable
      t.string :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string :unconfirmed_email

      ## Lockable
      t.integer :failed_attempts, default: 0, null: false
      t.string :unlock_token
      t.datetime :locked_at

      ## User Info
      t.string :name
      t.string :provider, null: false, default: "github"
      t.string :uid, null: false, default: ""

      ## Tokens
      t.jsonb :tokens, default: {}

      t.timestamps
    end

    add_index :users, [:uid, :provider], unique: true
    add_index :users, :unlock_token, unique: true
  end
end
