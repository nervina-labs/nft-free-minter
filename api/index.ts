import axios, { Axios } from 'axios'
import { NFTBOX_SERVER_URL } from '@/constants/env'
import { HolderToken } from '@/api/models/HolderToken'

export class API {
  private axios: Axios

  constructor() {
    this.axios = axios.create()
  }

  postAirdrops(address: string) {
    return this.axios.post('/api/airdrops', {
      address,
    })
  }

  getHolderTokens(address: string) {
    return this.axios.get<HolderToken>(`${NFTBOX_SERVER_URL}/holder_tokens`, {
      params: {
        address,
      },
    })
  }
}

export const api = new API()
