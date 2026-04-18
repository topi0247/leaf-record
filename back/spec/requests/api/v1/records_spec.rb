require 'rails_helper'

RSpec.describe 'Api::V1::Records', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:github_double) { instance_double(Github) }

  before { allow(Github).to receive(:new).and_return(github_double) }

  describe 'GET /api/v1/records' do
    context 'when authenticated' do
      before { create_list(:record, 3, user: user) }

      it 'returns all records for the current user' do
        get '/api/v1/records', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(3)
      end

      it 'returns records sorted by created_at desc' do
        get '/api/v1/records', headers: headers
        json = JSON.parse(response.body)
        dates = json.map { |r| r['created_at'] }
        expect(dates).to eq(dates.sort.reverse)
      end
    end

    context 'when not authenticated' do
      it 'returns 401' do
        get '/api/v1/records'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/records/:id' do
    let(:record) { create(:record, user: user) }

    context 'when repository exists' do
      before do
        allow(github_double).to receive(:repository_exists?).and_return(true)
        allow(github_double).to receive(:get_all_files).and_return([
          { name: 'README.md', path: 'README.md', content: '# Hello' }
        ])
      end

      it 'returns files' do
        get "/api/v1/records/#{record.repository_name}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['files'].length).to eq(1)
      end
    end

    context 'when repository does not exist' do
      before { allow(github_double).to receive(:repository_exists?).and_return(false) }

      it 'destroys the record and returns error' do
        get "/api/v1/records/#{record.repository_name}", headers: headers
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(Record.find_by(repository_name: record.repository_name)).to be_nil
      end
    end
  end

  describe 'POST /api/v1/records' do
    context 'when repository_name is available' do
      before do
        allow(github_double).to receive(:create_repository).and_return({ success: true, message: 'created' })
      end

      it 'creates a record' do
        expect {
          post '/api/v1/records', params: { repository_name: 'new-repo' }, headers: headers
        }.to change(Record, :count).by(1)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
      end
    end

    context 'when repository_name is already taken' do
      before { create(:record, user: user, repository_name: 'existing-repo') }

      it 'does not create a record' do
        expect {
          post '/api/v1/records', params: { repository_name: 'existing-repo' }, headers: headers
        }.not_to change(Record, :count)
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end

  describe 'PATCH /api/v1/records/:id' do
    let(:record) { create(:record, user: user) }
    let(:files) { [{ name: 'README.md', content: '# Updated', path: 'README.md', is_delete: false, old_path: 'README.md' }] }

    context 'when files are provided' do
      before do
        allow(github_double).to receive(:commit_push).and_return({ success: true })
      end

      it 'calls commit_push and returns success' do
        patch "/api/v1/records/#{record.repository_name}",
              params: { files: files },
              headers: headers
        expect(github_double).to have_received(:commit_push)
      end
    end

    context 'when files are not provided' do
      it 'returns error' do
        patch "/api/v1/records/#{record.repository_name}", headers: headers
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end

    context 'when record does not exist in DB' do
      it 'returns error' do
        patch '/api/v1/records/nonexistent-repo',
              params: { files: files },
              headers: headers
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end
end
