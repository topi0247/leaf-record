require 'openssl'
require 'base64'

module Decryptor
  def self.decrypt(encrypted_data)
    decipher = OpenSSL::Cipher.new('aes-256-cbc')
    decipher.decrypt
    decipher.key = Base64.decode64(ENV['GITHUB_TOKEN_ENCRYPT_KEY'])
    iv = Base64.decode64(encrypted_data['iv'].to_s)
    decipher.iv = iv
    decipher.update(Base64.decode64(encrypted_data['token'].to_s)) + decipher.final
  end
end