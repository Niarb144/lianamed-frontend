import React, { useEffect, useState } from "react";
import { api } from "../api/api";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import UserNav from "../components/UserNav";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await api.get(`/medicines/${id}`);
      setProduct(res.data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return (
    <div>
        <Navigation />
        <p className="p-10">Looking for the product ...</p>
        <Footer />
    </div>
    );

  return (
    <main>
        <UserNav />
        <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="grid md:grid-cols-2 gap-10 items-start">

            {/* Image */}
            <div>
            <img
                src={
                product.image
                    ? `http://localhost:5000${product.image}`
                    : "https://placehold.co/800x600?text=No+Image"
                }
                alt={product.name}
                className="w-full h-96 object-cover rounded-2xl shadow-md"
            />
            </div>

            {/* Product Info */}
            <div className="ml-20 bg-white p-6 rounded-2xl shadow-md w-150 h-auto">
                <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>

                <p className="text-blue-600 font-bold text-2xl mt-3">
                    KES {product.price}
                </p>

                <p>Category: <span className="text-2xl font-bold text-gray-800">{product.category}</span></p>
                

                <p className="text-gray-600 mt-5 leading-relaxed">
                    {product.description || "No description available."}
                </p>

                <p className="text-sm mt-4 text-gray-500">
                    Stock: {product.stock ?? "N/A"}
                </p>

                {product.prescription && (
                    <p className="text-sm text-red-500 font-medium mt-2">
                    ⚠ Requires prescription
                    </p>
                )}

                <button
                    onClick={() => addToCart(product)}
                    className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl text-lg transition-all cursor-pointer"
                >
                    🛒 Add to Cart
                </button>
            </div>

        </div>
        </div>
        <Footer />
    </main>
  );
}
