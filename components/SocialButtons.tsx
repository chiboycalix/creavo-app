"use client"

import { useEffect, useState } from "react"
import { GoogleLogin } from "@react-oauth/google"
import { ImSpinner2 } from "react-icons/im"
import axios from "axios"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"

import { useAuth, COOKIE_OPTIONS } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { baseUrl } from "@/utils/constant"
import { ROUTES } from "@/constants/routes"
import { STATUS_CODES } from "@/constants/statusCodes"

// 👇 TypeScript fix for window.google
declare global {
  interface Window {
    google: any
  }
}

const SocialButtons = () => {
  const { setAuth } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Disable Google One Tap and auto-select
    if (window.google) {
      if (window.google.accounts?.id?.disableAutoSelect) {
        window.google.accounts.id.disableAutoSelect()
      }

      // Cancel any existing One Tap prompts
      if (window.google.accounts?.id?.cancel) {
        window.google.accounts.id.cancel()
      }
    }
  }, [])

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setLoading(true)
    try {
      const idToken = credentialResponse.credential

      const res = await axios.post(`${baseUrl}/auth/google`, { idToken })
      const data = res.data

      const account = data?.data
      const token = account?.token

      if ((data.code === STATUS_CODES.OK || data.code === STATUS_CODES.CREATED) && account && token) {
        Cookies.set("accessToken", token, COOKIE_OPTIONS)
        setAuth(true, account, token)

        if (data.code === STATUS_CODES.CREATED) {
          showToast("success", "Account Created", "Welcome to Crevoe! Please complete your profile.")
        } else {
          showToast("success", "Login Successful", "Anyone with a link can now view this file.")
        }

        if (!account.profileSetupCompleted) {
          router.push(`${ROUTES.PROFILE(account.id)}`)
        } else {
          router.push(ROUTES.HOME)
        }
      } else if (data.code === "API_ERR_RESOURCE_NOT_FOUND") {
        showToast("info", "Account not found", "Please sign up to continue.")
      } else if (data.code && data.message) {
        showToast("error", "Google Login Failed", data.message)
      } else {
        showToast("error", "Google Login Failed", "Unexpected server response. Please try again.")
      }
    } catch (error: any) {
      console.error("Google auth failed:", error)
      showToast("error", "Google Login Failed", error?.message || "Please try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full my-3 flex flex-col gap-2">
      {loading ? (
        <div className="bg-white flex justify-center border-gray-600 border p-2.5 rounded-lg">
          <ImSpinner2 className="animate-spin text-2xl text-gray-600" />
        </div>
      ) : (
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showToast("error", "Google Login Failed", "Login was unsuccessful")}
            useOneTap={false}
            text="signin_with"
            width={800}
            size="large"
            theme="outline"
            type="standard"
            shape="rectangular"
            containerProps={{
              className: "w-full outline-black shadow-none",
              style: { display: "flex", justifyContent: "center" },
            }}
            logo_alignment="center"
            auto_select={false}
            itp_support={false}
          />
      )}
    </div>
  )
}

export default SocialButtons
