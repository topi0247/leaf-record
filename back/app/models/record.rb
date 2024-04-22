class Record < ApplicationRecord
  belongs_to :user
  validates :repository_name, presence: true, length: { maximum: 255 }
end
