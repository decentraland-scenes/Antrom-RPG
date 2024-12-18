import { type FlatFetchResponse, signedFetch } from '~system/SignedFetch'
import { waitUntilWalletIsConnected } from '../utils/wallet'

// const REDEEM_BASE_URL = `http://localhost:3000`;
const REDEEM_BASE_URL = `https://ipwpq4k3zi.execute-api.us-east-1.amazonaws.com`
const BASE_URL = `https://7ky6d8fqz1.execute-api.us-east-1.amazonaws.com`

export async function getData<T = unknown>(
  url: string,
  headers = {}
): Promise<T> {
  await waitUntilWalletIsConnected()

  console.log('getData', `${BASE_URL}${url}`)

  // Default options are marked with *
  const response = await signedFetch({
    url: `${BASE_URL}${url}`,
    init: {
      headers: { 'Content-Type': 'application/json' },
      method: 'GET'
    }
  })
  return JSON.parse(response.body) // parses JSON response into native JavaScript objects
}

export async function postData<T = unknown>(
  url: string,
  data = {}
): Promise<T> {
  // Default options are marked with *
  const response = await signedFetch({
    url: `${BASE_URL}${url}`,
    init: {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // TODO: doesn't have redirect
      // redirect: "follow", // manual, *follow, error
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }
  })
  return JSON.parse(response.body) // parses JSON response into native JavaScript objects
}

export async function postDataRedeem(
  url: string,
  data = {}
): Promise<FlatFetchResponse> {
  const response = await signedFetch({
    url: `${REDEEM_BASE_URL}${url}`,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // TODO: doesn't have redirect
      // redirect: "follow",
      body: JSON.stringify(data)
    }
  })
  return response
}

export async function postDataNoBase(
  url: string,
  data = {}
): Promise<FlatFetchResponse> {
  console.log('Request Body:', JSON.stringify(data))

  return await signedFetch({
    url: `${url}`,
    init: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }
  })
}

// update
// UDPAGTE
export async function updateData<T = unknown>(
  url: string,
  data = {}
): Promise<T> {
  // Default options are marked with *
  const response = await signedFetch({
    url: `${BASE_URL}${url}`,
    init: {
      method: 'PUT', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      // TODO: doesn't have redirect
      // redirect: "follow", // manual, *follow, error
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    }
  })
  return JSON.parse(response.body) // parses JSON response into native JavaScript objects
}

export async function getDataNoBase<T = unknown>(
  url: string,
  headers = {}
): Promise<T> {
  // Default options are marked with *
  const response = await signedFetch({
    url: `${url}`,
    init: {
      headers: {
        'Content-Type': 'application/json',
        ...headers
        // 'Content-Type': 'application/x-www-form-urlencoded',
      }
      // TODO: doesn't have redirect
      // redirect: "follow", // manual, *follow, error
    }
  })
  return JSON.parse(response.body) // parses JSON response into native JavaScript objects
}
