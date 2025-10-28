import React, { useState, useMemo } from "react";

const Products = () => {
  // Sample product data (you can fetch this from your backend)
  const initialProducts = [
    { id: 1, name: "Stethoscope", brand: "Medline", price: 2500 },
    { id: 2, name: "Thermometer", brand: "Omron", price: 1200 },
    { id: 3, name: "Blood Pressure Monitor", brand: "Beurer", price: 5500 },
    { id: 4, name: "Surgical Mask", brand: "3M", price: 200 },
    { id: 5, name: "Glucose Meter", brand: "Accu-Chek", price: 4500 },
    { id: 6, name: "Bandage Roll", brand: "Johnson & Johnson", price: 300 },
    { id: 7, name: "Oximeter", brand: "Omron", price: 3200 },
    { id: 8, name: "Hand Sanitizer", brand: "Dettol", price: 500 },
    { id: 9, name: "IV Set", brand: "BD", price: 700 },
    { id: 10, name: "Syringe Pack", brand: "BD", price: 100 },
  ];

  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [alphabetFilter, setAlphabetFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Extract unique brands for the dropdown
  const brands = [...new Set(initialProducts.map((p) => p.brand))];

  // Filter + Search logic
  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    // Search filter
    if (search.trim() !== "") {
      const term = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term)
      );
    }

    // Brand filter
    if (brandFilter) {
      products = products.filter((p) => p.brand === brandFilter);
    }

    // Price filter
    if (priceFilter === "low") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (priceFilter === "high") {
      products = products.sort((a, b) => b.price - a.price);
    }

    // Alphabet filter
    if (alphabetFilter === "asc") {
      products = products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (alphabetFilter === "desc") {
      products = products.sort((a, b) => b.name.localeCompare(a.name));
    }

    return products;
  }, [search, priceFilter, alphabetFilter, brandFilter, initialProducts]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Our Products</h2>
          <p className="text-gray-500 mt-2">
            Explore quality medical supplies at affordable prices
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex flex-wrap gap-3 justify-center md:justify-end">
            <select
              onChange={(e) => setBrandFilter(e.target.value)}
              value={brandFilter}
              className="px-3 py-2 border rounded-md text-sm focus:ring-blue-400"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <select
              onChange={(e) => setPriceFilter(e.target.value)}
              value={priceFilter}
              className="px-3 py-2 border rounded-md text-sm focus:ring-blue-400"
            >
              <option value="">Sort by Price</option>
              <option value="low">Low to High</option>
              <option value="high">High to Low</option>
            </select>

            <select
              onChange={(e) => setAlphabetFilter(e.target.value)}
              value={alphabetFilter}
              className="px-3 py-2 border rounded-md text-sm focus:ring-blue-400"
            >
              <option value="">Sort Alphabetically</option>
              <option value="asc">A - Z</option>
              <option value="desc">Z - A</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p className="mt-2 text-blue-600 font-bold">KES {product.price}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">
              No products found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 border rounded-md ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
