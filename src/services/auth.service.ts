import instance from './index'

export const loginService = async (userdata: { username: string, password: string }) => {
  try {
    const { data, status } = await instance.post('/auth/login', userdata)

    if (status !== 200) {
      throw new Error(data.message)
    }

    return {
      success: true,
      message: data.message
    }
  } catch (error: any) {
    throw {
      success: false,
      message: error.message
    }
  }
}

export const registerService = async (userdata: { fullName: string, username: string, password: string }) => {
  try {
    const { data, status } = await instance.post('/auth/register', userdata)

    if (status !== 201) {
      throw new Error(data.message)
    }

    return {
      success: true,
      message: data.message
    }
  } catch (error: any) {
    throw {
      success: false,
      message: error.message
    }
  }
}

export const logoutService = async () => {
  try {
    const { data, status } = await instance.post('/auth/logout')

    if (status !== 200) {
      throw new Error(data.message)
    }
    return {
      success: true,
      message: data.message
    }
  } catch (error: any) {
    throw {
      success: false,
      message: error.message
    }
  }
}