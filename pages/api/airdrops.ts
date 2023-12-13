import { NextApiRequest, NextApiResponse } from 'next'
import axios, { AxiosError } from 'axios'
import { NFTBOX_ACCESS_TOKEN, NFTBOX_SERVER_URL } from '@/constants'
import {
  SignMessageResponseData,
  // verifyCredential,
  verifySignature,
} from '@joyid/core'
import { ErrorCode } from '@/api/ErrorCode'

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  if (!('address' in req.body)) {
    res.status(400).end()
    return
  }
  const { address, ...signedData } = req.body as SignMessageResponseData & {
    address: string
  }
  // try {
  //   const isValid = await verifyCredential(
  //     signedData.pubkey,
  //     address,
  //     signedData.keyType,
  //     signedData.alg
  //   )
  //   if (!isValid) {
  //     res.status(401).json({ code: ErrorCode.INVALID_CREDENTIAL })
  //     return
  //   }
  // } catch (error: any) {
  //   res.status(500).json({
  //     code: ErrorCode.UNKNOWN_ERROR,
  //     message: error?.message,
  //   })
  //   return
  // }

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
      res.status(500)
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
      res.status(error.status || 500).json(error.response?.data || {})
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
