require 'rails_helper'

RSpec.describe Github do
  let(:user) { create(:user) }
  let(:octokit_client) { instance_double(Octokit::Client) }

  before do
    allow(Decryptor).to receive(:decrypt).and_return('dummy_token')
    allow(Octokit::Client).to receive(:new).with(access_token: 'dummy_token').and_return(octokit_client)
  end

  subject(:github) { described_class.new(user) }

  describe '#repository_exists?' do
    context 'リポジトリが存在する場合' do
      before { allow(octokit_client).to receive(:repository).and_return(double('repo')) }

      it 'trueを返す' do
        expect(github.repository_exists?('myrepo')).to be true
      end
    end

    context 'リポジトリが存在しない場合' do
      before { allow(octokit_client).to receive(:repository).and_raise(Octokit::NotFound) }

      it 'falseを返す' do
        expect(github.repository_exists?('myrepo')).to be false
      end
    end
  end

  describe '#create_repository' do
    context '作成が成功した場合' do
      before do
        allow(octokit_client).to receive(:create_repository).and_return(double('repo', truthy: true))
        allow(octokit_client).to receive(:create_contents)
      end

      it 'successを返す' do
        result = github.create_repository('newrepo')
        expect(result[:success]).to be true
      end
    end

    context 'リポジトリ名が既に存在する場合' do
      before do
        allow(octokit_client).to receive(:create_repository)
          .and_raise(Octokit::Error.new({ status: 422, body: { message: 'name already exists on this account' } }))
      end

      it 'エラーメッセージを含む失敗を返す' do
        result = github.create_repository('existingrepo')
        expect(result[:success]).to be false
        expect(result[:message]).to include('リポジトリ名が既に存在')
      end
    end
  end

  describe '#commit_push' do
    let(:ref_double) { double('ref', object: double('object', sha: 'base_sha')) }
    let(:tree_double) { double('tree', sha: 'tree_sha') }
    let(:commit_double) { double('commit', sha: 'commit_sha') }

    before do
      allow(octokit_client).to receive(:ref).and_return(ref_double)
      allow(octokit_client).to receive(:create_blob).and_return('blob_sha')
      allow(octokit_client).to receive(:create_tree).and_return(tree_double)
      allow(octokit_client).to receive(:create_commit).and_return(commit_double)
      allow(octokit_client).to receive(:update_ref)
    end

    let(:files) { [{ path: 'README.md', old_path: 'README.md', content: '# Hello', is_delete: false }] }

    it 'blob・tree・commitを作成してrefを更新する' do
      github.commit_push('myrepo', files, '2024/01/01 00:00:00')
      expect(octokit_client).to have_received(:create_blob)
      expect(octokit_client).to have_received(:create_tree)
      expect(octokit_client).to have_received(:create_commit)
      expect(octokit_client).to have_received(:update_ref)
    end

    context 'ファイルを削除する場合' do
      let(:files) { [{ path: 'old.md', old_path: 'old.md', content: '', is_delete: true }] }

      it '削除ファイルのblobを作成しない' do
        github.commit_push('myrepo', files, '2024/01/01 00:00:00')
        expect(octokit_client).not_to have_received(:create_blob)
      end
    end

    context 'ファイルをリネームする場合' do
      let(:files) { [{ path: 'new.md', old_path: 'old.md', content: '# Renamed', is_delete: false }] }

      it '新しいファイルのblobを作成し、旧パスを削除対象にする' do
        github.commit_push('myrepo', files, '2024/01/01 00:00:00')
        expect(octokit_client).to have_received(:create_blob).once
        expect(octokit_client).to have_received(:create_tree) do |_repo, blobs, _opts|
          delete_blob = blobs.find { |b| b[:path] == 'old.md' }
          expect(delete_blob[:sha]).to be_nil
        end
      end
    end

    context 'GitHub APIがエラーを返した場合' do
      before { allow(octokit_client).to receive(:ref).and_raise(Octokit::Error) }

      it '失敗を返す' do
        result = github.commit_push('myrepo', files, '2024/01/01 00:00:00')
        expect(result[:success]).to be false
      end
    end
  end
end
