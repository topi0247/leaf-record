class CreateRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :records do |t|
      t.integer :user_id , null: false
      t.string :repository_name, null: false, limit: 255
      t.timestamps
    end
    add_index :records, :user_id, unique: true
    add_index :records, [:user_id, :repository_name], unique: true
  end
end
