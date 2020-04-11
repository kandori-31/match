class User < ApplicationRecord
  # userモデルにフォロー、アンフォローをを定義
  def follow(other_user)
    unless self == other_user
      self.relationships.find_or_create_by(follow_id: other_user.id)
    end
  end

  def unfollow(other_user)
    relationship = self.relationships.find_by(follow_id: other_user.id)
    relationship.destroy if relationship
  end

  def following?(other_user)
    self.followings.include?(other_user)
  end

  def follower?(other_user)
    self.followers.include?(other_user)
  end 

  def matcher
    followings & followers
  end


  devise :database_authenticatable, :registerable,:recoverable, :rememberable, :validatable
  #架空のモデルを設定してアソシエーションを設定
  has_many :relationships
  has_many :followings, through: :relationships, source: :follow
  has_many :reverse_of_relationships, class_name: 'Relationship', foreign_key: 'follow_id'
  has_many :followers, through: :reverse_of_relationships, source: :user

  has_many :group_users
  has_many :groups, through: :group_users
  validates :gender,presence: true
  # introductionやname に文字数制限
  
  # validates :introduction,
  #   length: {  maximum: 100 }

  #carriewaveを使用するための記述
  mount_uploader :image, ImageUploader
end
