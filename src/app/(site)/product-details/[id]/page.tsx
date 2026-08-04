"use client";
import { useState, useEffect } from 'react';
import ProductCarousel from '@/components/PeopleBought';
import ProductDetails from '@/components/ProductDetails';
import { useParams } from 'next/navigation';

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.id as string;
  const [productId, setProductId] = useState<string | null>(null);
  
  // The ProductDetails component will fetch the product data,
  // so we need a way to get the actual product ID from it
  const handleProductLoaded = (id: string) => {
    setProductId(id);
  };
  
  return (
    <div>
      <ProductDetails slug={slug} onProductLoaded={handleProductLoaded} />
      {productId && <ProductCarousel productId={productId} productSlug={slug} />}
    </div>
  );
}