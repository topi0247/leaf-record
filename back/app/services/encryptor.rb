require 'openssl'
require 'base64'

module Encryptor
  def self.encrypt(data)
    cipher = OpenSSL::Cipher.new('aes-256-cbc')
    cipher.encrypt
    cipher.key = Base64.decode64(ENV['GITHUB_TOKEN_ENCRYPT_KEY'])
    iv = cipher.random_iv
    encrypted = cipher.update(data) + cipher.final
    { token: Base64.encode64(encrypted).chomp, iv: Base64.encode64(iv).chomp }
  end
end