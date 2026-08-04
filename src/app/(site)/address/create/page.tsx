import React from 'react'
import CreateAddressClient from '@/components/CreateAddressClient'

interface PageProps {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default function CreateAddressPage({ searchParams }: PageProps) {
  const id = typeof searchParams?.id === 'string' ? searchParams.id : undefined
  return (
    <div>
      <CreateAddressClient addressId={id} />
    </div>
  )
}