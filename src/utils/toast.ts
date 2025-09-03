import { toast } from 'react-toastify'
import type { ToastOptions } from 'react-toastify'

const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
}

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, {
    ...defaultToastOptions,
    ...options,
  })
}

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, {
    ...defaultToastOptions,
    ...options,
  })
}

export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, {
    ...defaultToastOptions,
    ...options,
  })
}

export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, {
    ...defaultToastOptions,
    ...options,
  })
}

export const showLoadingToast = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    ...defaultToastOptions,
    ...options,
  })
}
