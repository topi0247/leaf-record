FactoryBot.define do
  factory :record do
    sequence(:repository_name) { |n| "repo-#{n}" }
    association :user
  end
end
