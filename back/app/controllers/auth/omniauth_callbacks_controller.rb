class Auth::OmniauthCallbacksController < DeviseTokenAuth::OmniauthCallbacksController

  # オーバーライド
  # 後でよく確認する
  def redirect_callbacks
    user = User.from_omniauth(request.env['omniauth.auth'])

    if user.persisted?
      sign_in(user)
      # トークンを生成
      client_id = SecureRandom.urlsafe_base64(nil, false)
      token     = SecureRandom.urlsafe_base64(nil, false)
      token_hash = BCrypt::Password.create(token)
      expiry    = (Time.now + DeviseTokenAuth.token_lifespan).to_i
      github_token = request.env['omniauth.auth']['credentials']['token'].to_s

      user.tokens[client_id] = {
        token: token_hash,
        expiry: expiry
      }

      user.github_token = Encryptor.encrypt(github_token)

      if user.save
        redirect_to "#{ENV['FRONT_URL']}/user?uid=#{user.uid}&token=#{token}&client=#{client_id}&expiry=#{expiry}", allow_other_host: true
      else
        redirect_to "#{ENV['FRONT_URL']}/?status=error", allow_other_host: true
      end
    else
      Rails.logger.debug(user.errors.full_messages)
      redirect_to "#{ENV['FRONT_URL']}/?status=error", allow_other_host: true
    end
  end
end