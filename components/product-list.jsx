import ProductCard from "@/components/product-card"
import { useEffect } from "react"

export default function ProductList({ products, showQuantity }) {
  // Move debugging to useEffect to avoid issues during render
  useEffect(() => {
    const productIds = products.map(p => p.id);
    const duplicateIds = productIds.filter((id, index) => productIds.indexOf(id) !== index);
    
    if (duplicateIds.length > 0) {
      // Use console.warn instead of console.error to avoid breaking issues
      console.warn("Duplicate product IDs found:", duplicateIds);
      console.log("All product IDs:", productIds);
      console.log("Products with duplicate IDs:", 
        products.filter(p => duplicateIds.includes(p.id))
      );
    }
  }, [products]);

  // Remove duplicates by ID (keep the first occurrence)
  const uniqueProducts = products.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {uniqueProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
          <ProductCard
            {...product}
            sizes={product.sizes || ["M"]}
            colors={product.colors || []}
            inStock={product.inStock !== false}
          />
          {showQuantity && product.quantity && (
            <div className="mt-2 text-sm text-gray-600">
              Stock: {product.quantity} available
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Alternative version without any console logging (safest):
export function ProductListSafe({ products, showQuantity }) {
  // Simply remove duplicates without logging
  const uniqueProducts = products.filter((product, index, self) => 
    index === self.findIndex(p => p.id === product.id)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {uniqueProducts.map((product) => (
        <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
          <ProductCard
            {...product}
            sizes={product.sizes || ["M"]}
            colors={product.colors || []}
            inStock={product.inStock !== false}
          />
          {showQuantity && product.quantity && (
            <div className="mt-2 text-sm text-gray-600">
              Stock: {product.quantity} available
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// Advanced version with error boundary protection:
export function ProductListWithErrorBoundary({ products, showQuantity }) {
  const uniqueProducts = (() => {
    try {
      return products.filter((product, index, self) => 
        index === self.findIndex(p => p.id === product.id)
      );
    } catch (error) {
      // Fallback to original products if filtering fails
      console.warn("Error filtering duplicate products:", error);
      return products || [];
    }
  })();

  // Additional safety check
  if (!Array.isArray(uniqueProducts)) {
    return <div className="text-red-500">Error: Invalid products data</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {uniqueProducts.map((product) => {
        // Additional safety check for each product
        if (!product || !product.id) {
          return null;
        }
        
        return (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex flex-col">
            <ProductCard
              {...product}
              sizes={product.sizes || ["M"]}
              colors={product.colors || []}
              inStock={product.inStock !== false}
            />
            {showQuantity && product.quantity && (
              <div className="mt-2 text-sm text-gray-600">
                Stock: {product.quantity} available
              </div>
            )}
          </div>
        );
      })}
    </div>
  )
}