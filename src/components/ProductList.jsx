import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import ProductCard from "./ProductCard";
import { SearchInput } from "../../../components/common/inputs";

const ProductList = ({ onAddToCart, searchTerm, billType }) => {
  const { products } = useSelector((state) => state.inventory);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          billType={billType}
        />
      ))}
      {filteredProducts.length === 0 && (
        <p className="col-span-full text-center text-gray-500 py-4">
          No products found
        </p>
      )}
    </div>
  );
};

ProductList.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  billType: PropTypes.oneOf(["retail", "wholesale"]).isRequired,
};

export default ProductList;
