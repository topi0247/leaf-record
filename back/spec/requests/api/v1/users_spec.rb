require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  describe 'GET /api/v1/me' do
    context '認証済みの場合' do
      let(:user) { create(:user) }

      it '現在のユーザー情報を返す' do
        get '/api/v1/me', headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['user']['name']).to eq(user.name)
      end
    end

    context '未認証の場合' do
      it 'success: falseを返す' do
        get '/api/v1/me'
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end
end
