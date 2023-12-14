import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
import { NFTBOX_ACCESS_TOKEN, NFTBOX_SERVER_URL } from '@/constants'
import {
  SignMessageResponseData,
  verifySignature,
  CredentialKeyType,
  SigningAlg,
} from '@joyid/core'
import { ErrorCode } from '@/api/ErrorCode'

export const verifyCredential = async (
  pubkey: string,
  address: string,
  keyType: CredentialKeyType,
  alg: SigningAlg
) => {
  try {
    const url = `https://api.joy.id/api/v1/credentials/${address}`
    const result: any = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'api.joy.id',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.666.666.666 Safari/537.3',
      },
    }).then((res) => {
      return res.json()
    })

    return result.credentials.some((c: any) => {
      const pk =
        alg === -257 ||
        keyType === 'main_session_key' ||
        keyType === 'sub_session_key'
          ? c.public_key
          : c.public_key.slice(2)
      return c.ckb_address === address && pk === pubkey
    })
  } catch (error) {
    console.error(error)
    return false
  }
}

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!('address' in req.body)) {
    res.status(400).end()
    return
  }
  const { address, ...signedData } = req.body as SignMessageResponseData & {
    address: string
  }

  if (NFTBOX_SERVER_URL === 'https://api.nftbox.me/api/external/v1') {
    try {
      const isValid = await verifyCredential(
        signedData.pubkey,
        address,
        signedData.keyType,
        signedData.alg
      )
      if (!isValid) {
        res.status(401).json({ code: ErrorCode.INVALID_CREDENTIAL })
        return
      }
    } catch (error: any) {
      console.log('verify credential error')
      res.status(500).json({
        code: ErrorCode.INVALID_CREDENTIAL,
        message: error?.message,
        raw: error,
      })
      return
    }
  }

  try {
    const isValid = await verifySignature(signedData)
    if (!isValid) {
      res.status(401).json({ code: ErrorCode.INVALID_SIGNATURE })
      return
    }
  } catch (error: any) {
    console.log(error)
    res.status(500).json({
      code: ErrorCode.UNKNOWN_ERROR,
      message: error?.message,
    })
    return
  }
  try {
    await axios.post(
      `${NFTBOX_SERVER_URL}/airdrops`,
      { address },
      {
        params: {
          access_token: NFTBOX_ACCESS_TOKEN,
        },
      }
    )
    res.status(200)
  } catch (error) {
    console.error(error)
    if (error instanceof AxiosError) {
      res.status(error.status || 500).json(error.response?.data || {})
    } else {
      res.status(500).json(error instanceof Error ? error : {})
    }
  }
  res.end()
}

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await axios.get(`${NFTBOX_SERVER_URL}/airdrops`, {
      params: {
        access_token: NFTBOX_ACCESS_TOKEN,
      },
    })
    res.status(response.status).json(response.data)
  } catch (error) {
    console.error(error)
    if (error instanceof AxiosError) {
      res
        .status(error.status || error.response?.data?.status || 500)
        .json(error.response?.data || {})
    } else {
      res.status(500)
    }
  }
  res.end()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') return await getHandler(req, res)
  if (req.method === 'POST') return await postHandler(req, res)
  res.status(404).end()
}
