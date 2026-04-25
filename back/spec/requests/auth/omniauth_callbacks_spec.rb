require 'rails_helper'

RSpec.describe 'Auth::OmniauthCallbacks', type: :request do
  let(:omniauth_auth) do
    OmniAuth::AuthHash.new({
      provider: 'github',
      uid: 'github_uid_test',
      info: { name: 'Test User', email: 'test@example.com', nickname: 'testuser' },
      credentials: { token: 'github_access_token' }
    })
  end

  before do
    OmniAuth.config.test_mode = true
    OmniAuth.config.request_validation_phase = nil
    OmniAuth.config.mock_auth[:github] = omniauth_auth
  end

  after do
    OmniAuth.config.test_mode = false
    OmniAuth.config.request_validation_phase = OmniAuth::AuthenticityTokenProtection
  end

  describe 'GET /omniauth/github/callback' do
    context '新規ユーザーの場合' do
      it 'ユーザーを作成してrecordページにリダイレクトする' do
        get '/omniauth/github/callback'
        expect(response).to redirect_to("#{ENV['FRONT_URL']}/record")
      end

      it '認証Cookieをセットする' do
        get '/omniauth/github/callback'
        expect(response.cookies['access-token']).to be_present
        expect(response.cookies['client']).to be_present
        expect(response.cookies['uid']).to be_present
        expect(response.cookies['expiry']).to be_present
      end
    end

    context '既存ユーザーの場合' do
      before { create(:user, uid: 'github_uid_test', provider: 'github') }

      it 'recordページにリダイレクトする' do
        get '/omniauth/github/callback'
        expect(response).to redirect_to("#{ENV['FRONT_URL']}/record")
      end
    end

    context 'GitHubユーザーが取得できない場合' do
      before do
        allow(User).to receive(:from_omniauth).and_return(
          build(:user, uid: nil).tap { |u| u.valid? }
        )
      end

      it 'エラーページにリダイレクトする' do
        get '/omniauth/github/callback'
        expect(response.location).to include('status=error')
      end
    end
  end
end
