import { Injectable, inject } from '@angular/core'

import { AESEncryptDecrypt } from './aesencrypt-decrypt'

@Injectable({
  providedIn: 'root',
})
export class LocalStorage {
  token_key = 'O.o'
  profile_key = '|q_p|'
  private aesEncryptDecryptService = inject(AESEncryptDecrypt)

  setToken(value: unknown) {
    localStorage.setItem(this.token_key, JSON.stringify(value))
  }

  tokenExpired() {
    const token = this.getToken().access_token
    const expiry = JSON.parse(atob(token.split('.')[1])).exp
    return Math.floor(new Date().getTime() / 1000) >= expiry
  }

  getToken() {
    const oo = localStorage.getItem(this.token_key)
    return JSON.parse(oo ?? '')
  }

  isLogged() {
    if (this.getToken()) {
      return true
    } else {
      return false
    }
  }

  removeToken() {
    localStorage.removeItem(this.token_key)
    localStorage.removeItem(this.profile_key)
  }

  setProfile(value: string) {
    localStorage.setItem(this.profile_key, this.aesEncryptDecryptService.encrypt(value))
  }

  setKey(key: string, value: string) {
    localStorage.setItem(key, this.aesEncryptDecryptService.encrypt(value))
  }

  getKey(key: string) {
    const encryptedValue = localStorage.getItem(key)
    if (encryptedValue) {
      return this.aesEncryptDecryptService.decrypt(encryptedValue)
    }
    return null
  }

  getProfile() {
    const profile = localStorage.getItem(this.profile_key)
    if (!profile) {
      return null
    }
    return JSON.parse(this.aesEncryptDecryptService.decrypt(profile))
  }

  clearAllKeys() {
    localStorage.clear()
  }

  removeKey(key: string) {
    localStorage.removeItem(key)
  }
}
