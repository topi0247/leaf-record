class User < ApplicationRecord
# Include default devise modules.
  devise :registerable, :recoverable, :rememberable, :trackable,
          :omniauthable, omniauth_providers: %i[github]
  include DeviseTokenAuth::Concerns::User
  has_many :records, dependent: :destroy

  def self.from_omniauth(auth)
    # uidを取得
    uid = auth.uid

    # 同じuidのユーザーがいるか確認、いなかったら作る
    user = User.find_or_create_by(uid: uid) do |new_user|
      new_user.provider = auth.provider
      new_user.uid = auth.uid
      new_user.name = auth.info.nickname
    end

    user
  end

  def new_record(repository_name)
    if records.find_by(repository_name: repository_name).nil?
      records.new(repository_name: repository_name)
    else
    end
  end
end
