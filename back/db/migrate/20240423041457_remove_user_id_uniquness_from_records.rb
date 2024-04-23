class RemoveUserIdUniqunessFromRecords < ActiveRecord::Migration[7.1]
  def change
    remove_index :records, :user_id
    add_index :records, :user_id
  end
end
