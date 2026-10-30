// import React from 'react';
// import { Link } from 'react-router-dom';
// import { products } from '../assets/frontend_assets/assets';

// const ProductGallery = () => {
//   // 1. FILTER the products array to get ONLY those with subCategory: "Hoodies"
//   const hoodiesOnly = products.filter(
//     (product) => product.subCategory === 'Hoodies'
//   );

//   return (
//     <div className="product-gallery-container">
//       <h1 className="page-title">Hoodies Collection</h1>

//       {hoodiesOnly.length === 0 ? (
//         <p style={{ textAlign: 'center', fontSize: '1.2em' }}>
//           Sorry, no products found in the Hoodies category.
//         </p>
//       ) : (
//         // 2. MAP the filtered array (hoodiesOnly) for display
//         <div className="product-grid">
//           {hoodiesOnly.map((product) => (
            
//             // Link component to navigate to the detailed product page
//             <Link 
//               to={`/product/${product._id}`} 
//               key={product._id} 
//               className="product-card-link"
//             >
//               <div className="product-card">
                
//                 {/* Product Image (using the path from your data) */}
//                 <div className="card-image-wrapper">
//                   <img src={product.image[0]}  alt={product.name} className="product-image hover:scale-110 transition ease-in-out" />
              
//                 </div>

//                 {/* Product Information */}
//                 <div className="card-info">
//                   <p className="product-id">ID: {product._id}</p> 
//                   <h3 className="product-name">{product.name}</h3>
//                   <p className="product-subcategory">Category: {product.subCategory}</p> 
//                   <p className="product-price">LE {product.price} EGP</p>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductGallery;