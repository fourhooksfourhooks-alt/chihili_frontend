import React, { Suspense } from 'react'
import { PaymentContent } from './PaymentContent'
import ProtectedRoute from '@/components/RouteProtect'
import ChihiliLoader from '@/components/ChihiliLoader'

const PaymentPage=()=> {
  return (
    <ProtectedRoute>
      <div>
        <Suspense fallback={<ChihiliLoader message="Loading payment options..." />}>
          <PaymentContent />
        </Suspense> 
      </div>
    </ProtectedRoute>
  )
}

export default PaymentPage