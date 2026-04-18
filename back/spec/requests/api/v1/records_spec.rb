require 'rails_helper'

RSpec.describe 'Api::V1::Records', type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers(user) }
  let(:github_double) { instance_double(Github) }

  before { allow(Github).to receive(:new).and_return(github_double) }

  describe 'GET /api/v1/records' do
    context '認証済みの場合' do
      before { create_list(:record, 3, user: user) }

      it '現在のユーザーの全レコードを返す' do
        get '/api/v1/records', headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json.length).to eq(3)
      end

      it 'created_atの降順で返す' do
        get '/api/v1/records', headers: headers
        json = JSON.parse(response.body)
        dates = json.map { |r| r['created_at'] }
        expect(dates).to eq(dates.sort.reverse)
      end
    end

    context '未認証の場合' do
      it '401を返す' do
        get '/api/v1/records'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/records/:id' do
    let(:record) { create(:record, user: user) }

    context 'リポジトリが存在する場合' do
      before do
        allow(github_double).to receive(:repository_exists?).and_return(true)
        allow(github_double).to receive(:get_all_files).and_return([
          { name: 'README.md', path: 'README.md', content: '# Hello' }
        ])
      end

      it 'ファイル一覧を返す' do
        get "/api/v1/records/#{record.repository_name}", headers: headers
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
        expect(json['files'].length).to eq(1)
      end
    end

    context 'リポジトリが存在しない場合' do
      before { allow(github_double).to receive(:repository_exists?).and_return(false) }

      it 'レコードを削除してエラーを返す' do
        get "/api/v1/records/#{record.repository_name}", headers: headers
        json = JSON.parse(response.body)
        expect(json['success']).to be false
        expect(Record.find_by(repository_name: record.repository_name)).to be_nil
      end
    end
  end

  describe 'POST /api/v1/records' do
    context 'repository_nameが利用可能な場合' do
      before do
        allow(github_double).to receive(:create_repository).and_return({ success: true, message: 'created' })
      end

      it 'レコードを作成する' do
        expect {
          post '/api/v1/records', params: { repository_name: 'new-repo' }, headers: headers
        }.to change(Record, :count).by(1)
        json = JSON.parse(response.body)
        expect(json['success']).to be true
      end
    end

    context 'repository_nameが既に使用されている場合' do
      before { create(:record, user: user, repository_name: 'existing-repo') }

      it 'レコードを作成しない' do
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

    context 'ファイルが渡された場合' do
      before do
        allow(github_double).to receive(:commit_push).and_return({ success: true })
      end

      it 'commit_pushを呼び出す' do
        patch "/api/v1/records/#{record.repository_name}",
              params: { files: files },
              headers: headers
        expect(github_double).to have_received(:commit_push)
      end
    end

    context 'ファイルが渡されなかった場合' do
      it 'エラーを返す' do
        patch "/api/v1/records/#{record.repository_name}", headers: headers
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end

    context 'レコードがDBに存在しない場合' do
      it 'エラーを返す' do
        patch '/api/v1/records/nonexistent-repo',
              params: { files: files },
              headers: headers
        json = JSON.parse(response.body)
        expect(json['success']).to be false
      end
    end
  end
end
