Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth', controllers: {
    omniauth_callbacks: 'auth/omniauth_callbacks',
  }

  devise_scope :user do
    delete 'auth/sign_out', to: 'auth/sessions#destroy'
  end

  namespace :api do
    namespace :v1 do
      get 'me', to: 'users#me'
      resources :records, only: %i[index show create update]
    end
  end
end
