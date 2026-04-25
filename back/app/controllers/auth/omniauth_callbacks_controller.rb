class Auth::OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController
  skip_before_action :set_auth_headers_from_cookies

  def redirect_callbacks
    user = User.from_omniauth(request.env['omniauth.auth'])

    if user.persisted?
      sign_in(user)
      client_id  = SecureRandom.urlsafe_base64(nil, false)
      token      = SecureRandom.urlsafe_base64(nil, false)
      token_hash = BCrypt::Password.create(token)
      expiry     = (Time.now + DeviseTokenAuth.token_lifespan).to_i
      github_token = request.env['omniauth.auth']['credentials']['token'].to_s

      user.tokens[client_id] = {
        token: token_hash,
        expiry: expiry
      }

      user.github_token = Encryptor.encrypt(github_token)

      if user.save
        cookie_options = { httponly: true, secure: Rails.env.production? }
        cookies['access-token'] = cookie_options.merge(value: token)
        cookies['client']       = cookie_options.merge(value: client_id)
        cookies['uid']          = cookie_options.merge(value: user.uid)
        cookies['expiry']       = cookie_options.merge(value: expiry.to_s)

        redirect_to "#{ENV['FRONT_URL']}/record", allow_other_host: true
      else
        redirect_to "#{ENV['FRONT_URL']}/?status=error", allow_other_host: true
      end
    else
      Rails.logger.debug(user.errors.full_messages)
      redirect_to "#{ENV['FRONT_URL']}/?status=error", allow_other_host: true
    end
  end
end
