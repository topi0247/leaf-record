require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'アソシエーション' do
    it { is_expected.to have_many(:records).dependent(:destroy) }
  end

  describe '.from_omniauth' do
    let(:auth) do
      double('auth',
        uid: 'uid_123',
        provider: 'github',
        info: double('info', nickname: 'testuser')
      )
    end

    context 'ユーザーが存在しない場合' do
      it '新しいユーザーを作成する' do
        expect { User.from_omniauth(auth) }.to change(User, :count).by(1)
      end

      it '正しい属性を設定する' do
        user = User.from_omniauth(auth)
        expect(user.uid).to eq('uid_123')
        expect(user.name).to eq('testuser')
        expect(user.provider).to eq('github')
      end
    end

    context 'ユーザーが既に存在する場合' do
      before { create(:user, uid: 'uid_123', provider: 'github') }

      it '重複して作成しない' do
        expect { User.from_omniauth(auth) }.not_to change(User, :count)
      end
    end
  end

  describe '#new_record' do
    let(:user) { create(:user) }

    context 'repository_nameが未使用の場合' do
      it '新しいRecordインスタンスを返す' do
        record = user.new_record('new-repo')
        expect(record).to be_a(Record)
        expect(record).not_to be_persisted
      end
    end

    context 'repository_nameが既に使用されている場合' do
      before { create(:record, user: user, repository_name: 'existing-repo') }

      it 'nilを返す' do
        expect(user.new_record('existing-repo')).to be_nil
      end
    end
  end
end
