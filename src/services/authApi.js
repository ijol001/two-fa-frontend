import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
  reducerPath: 'authApi',
  //  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api/user/' }),

  endpoints: (builder) => ({

    userReg: builder.mutation({                     
      query:(user)=>{
        return{
            url: 'reg',
            method:'POST',
            body: user,
            headers:{
                'Content-type': 'application/json',
            }
        }
      }
    }),
    userLogin: builder.mutation({
      query:(user)=>{
        return{
          url: 'login',
          method: 'POST',
          body: user,
          headers:{
            'Content-type': 'application/json'
          }
        }
      }
    }),
    verifyOTP: builder.mutation({
      query: (user) => {
        return {
          url: 'verify-otp',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
    verifyloginOTP: builder.mutation({
      query: (user) => {
        return {
          url: 'verify-login-otp',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          }
        }
      }
    }),
})
})

export const {useUserRegMutation, useUserLoginMutation , useVerifyOTPMutation, useVerifyloginOTPMutation} =authApi  