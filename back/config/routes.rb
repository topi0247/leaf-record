Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth',controllers: {
    omniauth_callbacks: 'auth/omniauth_callbacks',
    registrations: 'auth/registrations'
  }

  namespace :api do
    namespace :v1 do
      get 'me', to: 'users#me'
    end
  end
end
