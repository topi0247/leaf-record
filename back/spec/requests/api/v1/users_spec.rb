require 'rails_helper'

RSpec.describe 'Api::V1::Users', type: :request do
  describe 'GET /api/v1/me' do
    context 'when authenticated' do
      let(:user) { create(:user) }

      it 'returns the current user' do
        get '/api/v1/me', headers: auth_headers(user)
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['user']['name']).to eq(user.name)
      end
    end

    context 'when not authenticated' do
      it 'returns success: false' do
        get '/api/v1/me'
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end
end
