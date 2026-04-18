require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'associations' do
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

    context 'when user does not exist' do
      it 'creates a new user' do
        expect { User.from_omniauth(auth) }.to change(User, :count).by(1)
      end

      it 'sets the correct attributes' do
        user = User.from_omniauth(auth)
        expect(user.uid).to eq('uid_123')
        expect(user.name).to eq('testuser')
        expect(user.provider).to eq('github')
      end
    end

    context 'when user already exists' do
      before { create(:user, uid: 'uid_123', provider: 'github') }

      it 'does not create a duplicate' do
        expect { User.from_omniauth(auth) }.not_to change(User, :count)
      end
    end
  end

  describe '#new_record' do
    let(:user) { create(:user) }

    context 'when repository_name is not taken' do
      it 'returns a new Record instance' do
        record = user.new_record('new-repo')
        expect(record).to be_a(Record)
        expect(record).not_to be_persisted
      end
    end

    context 'when repository_name is already taken' do
      before { create(:record, user: user, repository_name: 'existing-repo') }

      it 'returns nil' do
        expect(user.new_record('existing-repo')).to be_nil
      end
    end
  end
end
