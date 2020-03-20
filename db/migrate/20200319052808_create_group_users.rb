class CreateGroupUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :group_users do |t|
      t.references :group, forign_key: true 
      t.references :user, forign_key: true
      t.timestamps
    end
  end
end
