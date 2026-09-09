import axios from "axios"
import Cookies from "js-cookie"

import { AuthErrorMessages } from "~/hr-port/constants"
import {
  paramsToQueryString,
  publicRoutes,
} from "~/hr-port/features/common/utils/routers"
import { getMapFromArray } from "~/hr-port/utils/object"

import { env } from "./env"

export const isLoggedIn = { success: false }
export const csrfToken = { token: "" }

export const apiPublic = axios.create({
  baseURL: env.API_URL,
})

export const apiPrivate = axios.create({
  baseURL: env.API_URL,
  headers: { "Content-Type": "application/json" },
  paramsSerializer: {
    serialize: (params) => {
      return paramsToQueryString(params)
    },
  },
  withCredentials: true,
})

apiPrivate.interceptors.request.use(
  (config) => {
    if (config.method !== "get") {
      const cookieCsrfToken = Cookies.get("CSRF-TOKEN")
      config.headers["X-CSRF-TOKEN"] = cookieCsrfToken ?? csrfToken.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const reloadStatuses = [401, 403]

apiPrivate.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    try {
      const isPublicRoute = publicRoutes.includes(window.location.pathname)
      if (!isPublicRoute && isLoggedIn.success) {
        const errorStatus = error.response.status
        const isReloadStatus = reloadStatuses.includes(errorStatus)

        if (isReloadStatus) {
          window.location.reload()
        } else if (errorStatus === 500) {
          const metadatas = error.response.data?.metadatas
          if (metadatas) {
            const errorsMessageMap = getMapFromArray(
              metadatas,
              "message",
              () => true
            )
            const isTaApiCallFailed =
              errorsMessageMap[AuthErrorMessages.TA_API_CALL_FAILED]
            if (isTaApiCallFailed) {
              window.location.reload()
            }
          }
        }
      }
    } catch (err) {
      console.error(err)
    }
    return Promise.reject(error)
  }
)
