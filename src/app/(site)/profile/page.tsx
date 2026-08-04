import OrderHistory from '@/components/OrderHIstory'
import ProfileTabs from '@/components/ProfileTab'
import ProtectedRoute from '@/components/RouteProtect'
import React from 'react'

export default function ProfilePage(){
  return (
    <ProtectedRoute>
      <div className='bg-secondary min-h-screen'>
        <ProfileTabs />
        {/* <OrderHistory /> */}
      </div>
    </ProtectedRoute>
  )
}
