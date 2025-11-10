import React, { useEffect, useState } from 'react';
import MenuUI from './Menu.jsx';
import api from '../../services/api';

const Menu = ({ username, onAddToCart }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/public/categories');
      setCategories(response.data.content || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = `/public/products?pageNumber=${page}`;

        if (searchQuery.trim()) {
          url = `/public/products/keyword/${encodeURIComponent(searchQuery.trim())}?pageNumber=${page}&pageSize=10&sortBy=productName&sortOrder=desc`;
        } else if (category !== 'all') {
          url = `/public/categories/${category}/products?pageNumber=${page}`;
        }

        const response = await api.get(url);
        const fetchedProducts = response.data.content || [];

        setProducts(fetchedProducts);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, page, category]);

  // Client-side filtering of fetched products using searchTerm
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const term = searchTerm.trim().toLowerCase();
      const filtered = products.filter(product =>
        product.productName.toLowerCase().includes(term) ||
        (product.description && product.description.toLowerCase().includes(term))
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(0);
  };

  const handleSearchSubmit = () => {
    setPage(0);
    setSearchQuery(searchTerm); // triggers backend fetch
  };

  return (
    <MenuUI
      username={username}
      categories={categories}
      category={category}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      handleSearchSubmit={handleSearchSubmit}
      products={filteredProducts}
      totalPages={totalPages}
      page={page}
      handleCategoryChange={handleCategoryChange}
      setPage={setPage}
      onAddToCart={onAddToCart}
      isLoading={isLoading}
    />
  );
};

export default Menu;
