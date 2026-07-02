import React,{useEffect,useState} from 'react';
import {useParams,Link,useNavigate} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {addToCart} from "../redux/cartSlice";
import '../styles/ProductDetails.css'
const ProductDetails = () =>{
  const {id} = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const[product,setProduct] = useState(null);
  const[loading,setLoading] = useState(true);
  const[quantity,setQuantity] = useState(1);
  const[toastMessage,setToastMessage] = useState("");

  useEffect(() =>{
    const fetchProduct = async () =>{
      try{
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if(!res.ok){
          throw new Error("Failed to fetch product");
        }
        const data = await res.json();
        setProduct(data?.product || null);
      }catch(error){
        console.error(error);
        setProduct(null);
      }finally{
        setLoading(false);
      }
    };
    if(id){
      fetchProduct();
    }else{
      setProduct(null);
      setLoading(false);
    }
  },[id]);

  const stock = Number(product?.stock || 0);
  const isOutOfStock = stock <= 0;
  const productPrice = Number(product?.price || 0);
  const safePrice = Number.isFinite(productPrice) ? productPrice : 0;
  const displayPrice = safePrice.toFixed(2);
  const productRating = Number(product?.rating || 4.6);
  const safeRating = Number.isFinite(productRating) ? Math.min(5, Math.max(0, productRating)) : 4.6;
  const roundedRating = Math.round(safeRating);
  const ratingStars = `${"⭐".repeat(roundedRating)}${"☆".repeat(5 - roundedRating)}`;

  const showToast = (message) =>{
    setToastMessage(message);
    window.setTimeout(() =>{
      setToastMessage("");
    },3000);
  }

  const handleAddToCart = () =>{
    if(product?._id && !isOutOfStock){
      dispatch(addToCart({
        _id: product._id,
        name: product?.name || "",
        price: safePrice,
        imageUrl: product?.imageUrl || "",
        quantity
      }));
      showToast("Product successfully added to cart");
    }
  }

  const handleBuyNow = () =>{
    if(product?._id && !isOutOfStock){
      dispatch(addToCart({
        _id: product._id,
        name: product?.name || "",
        price: safePrice,
        imageUrl: product?.imageUrl || "",
        quantity
      }));
      navigate("/cart");
    }
  }

  const handleWishlist = () =>{
    if(product?._id){
      try{
        const wishlistItems = JSON.parse(localStorage.getItem("wishlistItems")) || [];
        const existingItem = wishlistItems.find((item) => item._id === product._id);

        if(existingItem){
          showToast("Product already in wishlist");
          return;
        }

        localStorage.setItem("wishlistItems", JSON.stringify([
          ...wishlistItems,
          {
            _id: product._id,
            name: product?.name || "",
            price: safePrice,
            imageUrl: product?.imageUrl || ""
          }
        ]));
        showToast("Product added to wishlist");
      }catch(error){
        console.error(error);
        showToast("Unable to update wishlist");
      }
    }
  }

 if (loading) {
  return (
    <div className="page-loader">
      <div className="loader"></div>
      <h2>Loading Product...</h2>
      <p>Please wait while we fetch the latest product details.</p>
    </div>
  );
}

if (!product) {
  return (
    <div className="page-error">
      <div className="error-icon">⚠️</div>
      <h2>Product Not Found</h2>
      <p>
        Sorry! The product you're looking for doesn't exist or has been removed.
      </p>
    </div>
  );
}
  return (
    <div className="product-details-wrapper">
      {toastMessage && (
        <div className="toast-notification" role="alert">
          {toastMessage}
        </div>
      )}

      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/shop">Shop</Link>
        <span>›</span>
        <span>{product?.category || "Product"}</span>
      </nav>

      <div className="product-details">
        <div className="detail-image-container">
          <img src={product?.imageUrl || "/image.png"} alt={product?.name || "Product"} className='detail-image'/>
        </div>

        <div className="detail-info">
          <h2>{product?.name || "Product"}</h2>
          <div className="product-rating">
            {ratingStars}
            <span>({safeRating.toFixed(1)})</span>
          </div>
          <p className='detail-price'>₹{displayPrice}</p>
          <span
          className={
            !isOutOfStock
            ?
            "stock in-stock"
            :
            "stock out-stock"
          }
          >
            {!isOutOfStock
            ?
            `${stock} Available`
            :
            "Out of Stock"}
          </span>

          {/* description */}
          <section className="description-box">
          <h3>Description</h3>
          <p>{product?.description || ""}</p>
          </section>

          <div className="product-meta">
          <p>
          <strong>Category :</strong> {product?.category || "Product"}
          </p>
          <p>
          <strong>Brand :</strong> {product?.brand || "ShopNest"}
          </p>
          </div>

          <div className="delivery-box">
          <h4>🚚 Delivery</h4>
          <p>
          Free Delivery within 3-5 Days
          </p>
          </div>

          <div className="return-box">
          <h4>🔄 Easy Returns</h4>
          <p>
          7-Day Easy Return Policy
          </p>
          </div>

          <div className="payment-box">
          <h4>🔒 Secure Payments</h4>
          <p>
          100% Secure Payment Gateway
          </p>
          </div>

          {/* cart  stock actions */}
          <div className="quantity-selector">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </button>
          </div>

          <div className="action-buttons">
          <button
            type="button"
            className="cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            🛒 Add to Cart
          </button>

          <button
            type="button"
            className="buy-btn"
            onClick={handleBuyNow}
            disabled={isOutOfStock}
          >
            ⚡ Buy Now
          </button>

          <button
            type="button"
            className="wishlist-btn"
            onClick={handleWishlist}
          >
            ♡ Wishlist
          </button>
          </div> 

        </div>
      </div>
    </div>
  );

};


export default ProductDetails;
