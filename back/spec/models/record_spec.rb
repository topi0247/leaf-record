require 'rails_helper'

RSpec.describe Record, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to belong_to(:user) }
  end

  describe 'バリデーション' do
    it { is_expected.to validate_presence_of(:repository_name) }
    it { is_expected.to validate_length_of(:repository_name).is_at_most(255) }
  end
end
