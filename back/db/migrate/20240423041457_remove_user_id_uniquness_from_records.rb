class RemoveUserIdUniqunessFromRecords < ActiveRecord::Migration[7.1]
  def change
    add_index :records, :user_id
  end
end
