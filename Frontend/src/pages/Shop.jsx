import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaBoxOpen,
  FaEye,
  FaHeart,
  FaList,
  FaSearch,
  FaShoppingCart,
  FaSlidersH,
  FaSortAmountDown,
  FaStar,
  FaSyncAlt,
  FaThLarge,
  FaTimes,
} from "react-icons/fa";

import { addToCart } from "../redux/cartSlice";
import "../styles/Shop.css";

const PAGE_SIZE = 12;

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A-Z" },
];

const stockOptions = [
  { value: "all", label: "All Products" },
  { value: "available", label: "In Stock" },
  { value: "low", label: "Low Stock" },
  { value: "out", label: "Out Of Stock" },
];

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const getStockLabel = (stock) => {
  const value = Number(stock || 0);

  if (value <= 0) {
    return "Out of stock";
  }

  if (value <= 5) {
    return `Only ${value} left`;
  }

  return "In stock";
};

const getStockClass = (stock) => {
  const value = Number(stock || 0);

  if (value <= 0) {
    return "out";
  }

  if (value <= 5) {
    return "low";
  }

  return "ready";
};

const Shop = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [stockFilter, setStockFilter] = useState(searchParams.get("stock") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "featured");
  const [priceLimit, setPriceLimit] = useState(
    Number(searchParams.get("maxPrice")) > 0 ? Number(searchParams.get("maxPrice")) : null
  );
  const [viewMode, setViewMode] = useState("grid");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [favorites, setFavorites] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load products.");
        }

        if (isMounted) {
          setProducts(Array.isArray(data.products) ? data.products : []);
        }
      } catch (fetchError) {
        console.error(fetchError);

        if (isMounted) {
          setError(fetchError.message || "Unable to load products.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return [
      "all",
      ...new Set(products.map((product) => product?.category).filter(Boolean)),
    ].sort((first, second) => {
      if (first === "all") return -1;
      if (second === "all") return 1;
      return first.localeCompare(second);
    });
  }, [products]);

  const maxPrice = useMemo(() => {
    return Math.max(...products.map((product) => Number(product?.price || 0)), 0);
  }, [products]);

  const activePriceLimit = priceLimit ?? maxPrice;

  useEffect(() => {
    if (maxPrice > 0 && (priceLimit === null || priceLimit > maxPrice)) {
      setPriceLimit(maxPrice);
    }
  }, [maxPrice, priceLimit]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);
    if (stockFilter !== "all") params.set("stock", stockFilter);
    if (sortBy !== "featured") params.set("sort", sortBy);
    if (maxPrice > 0 && activePriceLimit < maxPrice) {
      params.set("maxPrice", String(activePriceLimit));
    }

    setSearchParams(params, { replace: true });
  }, [activePriceLimit, category, maxPrice, query, setSearchParams, sortBy, stockFilter]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activePriceLimit, category, query, sortBy, stockFilter]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setNotice(""), 2600);

    return () => window.clearTimeout(timeout);
  }, [notice]);

  const filteredProducts = useMemo(() => {
    const searchText = query.trim().toLowerCase();

    const nextProducts = products.filter((product) => {
      const stock = Number(product?.stock || 0);
      const price = Number(product?.price || 0);
      const haystack = `${product?.name || ""} ${product?.description || ""} ${
        product?.category || ""
      }`.toLowerCase();

      const matchesSearch = !searchText || haystack.includes(searchText);
      const matchesCategory = category === "all" || product?.category === category;
      const matchesPrice = !activePriceLimit || price <= activePriceLimit;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "available" && stock > 5) ||
        (stockFilter === "low" && stock > 0 && stock <= 5) ||
        (stockFilter === "out" && stock <= 0);

      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });

    return nextProducts.sort((firstProduct, secondProduct) => {
      const firstPrice = Number(firstProduct?.price || 0);
      const secondPrice = Number(secondProduct?.price || 0);
      const firstRating = Number(firstProduct?.rating || 0);
      const secondRating = Number(secondProduct?.rating || 0);
      const firstStock = Number(firstProduct?.stock || 0);
      const secondStock = Number(secondProduct?.stock || 0);

      if (sortBy === "price-low") return firstPrice - secondPrice;
      if (sortBy === "price-high") return secondPrice - firstPrice;
      if (sortBy === "rating") return secondRating - firstRating;
      if (sortBy === "newest") {
        return new Date(secondProduct?.createdAt || 0) - new Date(firstProduct?.createdAt || 0);
      }
      if (sortBy === "name") {
        return String(firstProduct?.name || "").localeCompare(String(secondProduct?.name || ""));
      }

      return (
        Number(secondProduct?.featured || secondRating >= 4.5) -
          Number(firstProduct?.featured || firstRating >= 4.5) ||
        Number(secondStock > 0) - Number(firstStock > 0) ||
        secondRating - firstRating
      );
    });
  }, [activePriceLimit, category, products, query, sortBy, stockFilter]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const inStockCount = products.filter((product) => Number(product?.stock || 0) > 0).length;
  const lowStockCount = products.filter((product) => {
    const stock = Number(product?.stock || 0);
    return stock > 0 && stock <= 5;
  }).length;

  const getCartQuantity = (productId) => {
    return cartItems.find((item) => item._id === productId)?.quantity || 0;
  };

  const handleAddToCart = (product) => {
    const stock = Number(product?.stock || 0);
    const cartQuantity = getCartQuantity(product?._id);

    if (stock <= 0) {
      setNotice(`${product?.name || "Product"} is currently out of stock.`);
      return;
    }

    if (cartQuantity >= stock) {
      setNotice(`You already have all available stock for ${product?.name || "this item"}.`);
      return;
    }

    dispatch(addToCart(product));
    setNotice(`${product?.name || "Product"} added to cart.`);
  };

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setStockFilter("all");
    setSortBy("featured");
    setPriceLimit(maxPrice);
    setIsFilterOpen(false);
  };

  const hasActiveFilters =
    query.trim() ||
    category !== "all" ||
    stockFilter !== "all" ||
    sortBy !== "featured" ||
    (maxPrice > 0 && activePriceLimit < maxPrice);

  return (
    <main className="shop-page">
      <section className="shop-header">
        <div className="shop-header-copy">
          <span>ShopNest Store</span>
          <h1>Shop All Products</h1>
          <p>{products.length} products across {Math.max(categories.length - 1, 0)} categories.</p>
        </div>

        <div className="shop-stats" aria-label="Shop summary">
          <div>
            <strong>{products.length}</strong>
            <span>Products</span>
          </div>
          <div>
            <strong>{inStockCount}</strong>
            <span>In Stock</span>
          </div>
          <div>
            <strong>{lowStockCount}</strong>
            <span>Low Stock</span>
          </div>
        </div>
      </section>

      <section className="shop-control-bar">
        <label className="shop-search">
          <FaSearch />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, categories, brands..."
          />
        </label>

        <button
          type="button"
          className="shop-filter-toggle"
          onClick={() => setIsFilterOpen(true)}
        >
          <FaSlidersH />
          Filters
        </button>

        <label className="shop-sort">
          <FaSortAmountDown />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            {sortOptions.map((option) => (
              <option value={option.value} key={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <div className="shop-view-toggle" aria-label="Product view">
          <button
            type="button"
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <FaThLarge />
          </button>
          <button
            type="button"
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <FaList />
          </button>
        </div>
      </section>

      <div className="shop-layout">
        {isFilterOpen && (
          <button
            type="button"
            className="shop-filter-backdrop"
            aria-label="Close filters"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        <aside className={isFilterOpen ? "shop-filters open" : "shop-filters"}>
          <div className="shop-filter-head">
            <div>
              <span>Refine</span>
              <h2>Filters</h2>
            </div>
            <button type="button" onClick={() => setIsFilterOpen(false)} aria-label="Close filters">
              <FaTimes />
            </button>
          </div>

          <div className="shop-filter-group">
            <h3>Categories</h3>
            <div className="shop-chip-list">
              {categories.map((item) => (
                <button
                  type="button"
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                  key={item}
                >
                  {item === "all" ? "All Categories" : item}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-filter-group">
            <h3>Availability</h3>
            <div className="shop-option-list">
              {stockOptions.map((option) => (
                <button
                  type="button"
                  className={stockFilter === option.value ? "active" : ""}
                  onClick={() => setStockFilter(option.value)}
                  key={option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-filter-group">
            <div className="shop-price-head">
              <h3>Price</h3>
              <strong>{formatCurrency(activePriceLimit)}</strong>
            </div>
            <input
              className="shop-range"
              type="range"
              min="0"
              max={Math.max(maxPrice, 1)}
              value={activePriceLimit || 0}
              onChange={(event) => setPriceLimit(Number(event.target.value))}
            />
            <div className="shop-range-labels">
              <span>{formatCurrency(0)}</span>
              <span>{formatCurrency(maxPrice)}</span>
            </div>
          </div>

          <button type="button" className="shop-reset-btn" onClick={resetFilters}>
            <FaSyncAlt />
            Reset Filters
          </button>
        </aside>

        <section className="shop-results">
          <div className="shop-results-head">
            <div>
              <span>{filteredProducts.length} results</span>
              <h2>{category === "all" ? "All Products" : category}</h2>
            </div>

            {hasActiveFilters && (
              <button type="button" onClick={resetFilters}>
                Clear all
              </button>
            )}
          </div>

          {notice && <div className="shop-notice">{notice}</div>}

          {isLoading ? (
            <div className="shop-product-grid">
              {Array.from({ length: 8 }).map((_, index) => (
                <div className="shop-skeleton-card" key={`shop-skeleton-${index}`} />
              ))}
            </div>
          ) : error ? (
            <div className="shop-empty-state">
              <FaBoxOpen />
              <h3>Products could not load</h3>
              <p>{error}</p>
              <button type="button" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          ) : visibleProducts.length ? (
            <>
              <div className={`shop-product-grid ${viewMode}`}>
                {visibleProducts.map((product) => {
                  const stock = Number(product?.stock || 0);
                  const cartQuantity = getCartQuantity(product?._id);
                  const isFavorite = favorites.includes(product?._id);

                  return (
                    <article className="shop-product-card" key={product?._id}>
                      <div className="shop-product-media">
                        <span className={`shop-stock-badge ${getStockClass(stock)}`}>
                          {getStockLabel(stock)}
                        </span>

                        <button
                          type="button"
                          className={isFavorite ? "shop-wishlist active" : "shop-wishlist"}
                          aria-label="Toggle wishlist"
                          onClick={() =>
                            setFavorites((current) =>
                              current.includes(product?._id)
                                ? current.filter((id) => id !== product?._id)
                                : [...current, product?._id]
                            )
                          }
                        >
                          <FaHeart />
                        </button>

                        <img
                          src={product?.imageUrl || "/image.png"}
                          alt={product?.name || "Product"}
                          loading="lazy"
                        />
                      </div>

                      <div className="shop-product-body">
                        <div className="shop-product-topline">
                          <span>{product?.category || "Uncategorized"}</span>
                          <strong>
                            <FaStar />
                            {Number(product?.rating || 4.5).toFixed(1)}
                          </strong>
                        </div>

                        <h3>
                          <Link to={`/product/${product?._id}`}>{product?.name || "Product"}</Link>
                        </h3>

                        <p>{product?.description || "Premium ShopNest product."}</p>

                        <div className="shop-product-footer">
                          <div>
                            <span>Price</span>
                            <strong>{formatCurrency(product?.price)}</strong>
                          </div>
                          {cartQuantity > 0 && <small>{cartQuantity} in cart</small>}
                        </div>

                        <div className="shop-product-actions">
                          <button
                            type="button"
                            className="shop-cart-btn"
                            onClick={() => handleAddToCart(product)}
                            disabled={stock <= 0 || cartQuantity >= stock}
                          >
                            <FaShoppingCart />
                            {stock <= 0
                              ? "Sold Out"
                              : cartQuantity >= stock
                                ? "Max Added"
                                : "Add To Cart"}
                          </button>

                          <Link to={`/product/${product?._id}`} className="shop-view-btn">
                            <FaEye />
                            View
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {visibleCount < filteredProducts.length && (
                <div className="shop-load-more">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((current) => current + PAGE_SIZE)}
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="shop-empty-state">
              <FaBoxOpen />
              <h3>No products found</h3>
              <p>Try another search, category, price range, or stock filter.</p>
              <button type="button" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Shop;
