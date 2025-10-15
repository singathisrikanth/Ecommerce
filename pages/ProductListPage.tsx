
import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { SearchIcon } from '../components/icons/SearchIcon';

interface ProductListPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

const ProductListPage: React.FC<ProductListPageProps> = ({ products, onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, searchTerm, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-brand-primary mb-2">Find Your Next Favorite Thing</h1>
        <p className="text-lg text-gray-600">Browse our curated collection of high-quality products.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center p-4 bg-white rounded-lg shadow-sm">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-accent"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      ) : (
         <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No Products Found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
         </div>
      )}
    </div>
  );
};

export default ProductListPage;
