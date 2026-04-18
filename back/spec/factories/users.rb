FactoryBot.define do
  factory :user do
    sequence(:uid) { |n| "github_uid_#{n}" }
    sequence(:name) { |n| "user#{n}" }
    provider { 'github' }
    github_token { { 'token' => 'dummy_encrypted', 'iv' => 'dummy_iv' } }
    tokens { {} }
  end
end
