Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth',controllers: {
    omniauth_callbacks: 'auth/omniauth_callbacks',
    registrations: 'auth/registrations'
  }

  namespace :api do
    namespace :v1 do
      get 'me', to: 'users#me'
      resources :records, only: %i[index show create destroy]
    end
  end
end
