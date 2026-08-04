import OrderDetails from '@/components/OrderDetails'
import ProductCarousel from '@/components/PeopleBought'
import ProtectedRoute from '@/components/RouteProtect'
import React from 'react'

interface PageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <div>
        <OrderDetails orderId={params.id} />
        <ProductCarousel/>
      </div>
    </ProtectedRoute>
  )
}
