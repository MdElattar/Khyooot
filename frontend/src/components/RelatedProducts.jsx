import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';
// ...

const RelatedProducts = ({ category, subCategory }) => {


    const navigate = useNavigate();
    const { products } = useContext(ShopContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {

        if (products.length > 0) {
            let productsCopy = products.slice();

            productsCopy = productsCopy.filter((item) => category === item.category);
            productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);

            // (The code snippet ends here, but you would typically set the state)
            setRelated(productsCopy.slice(0.5)); 
        }

    }, [products]);

    const handleProductClick = (newProductId) => {
    // This changes the URL to the new product's page.
    // The main Product component will automatically re-render and fetch new data.
    navigate(`/product/${newProductId}`);

    // Optional: Scroll back to the top of the page for better UX
    window.scrollTo(0, 0); 
};

  return (
    <div className='my-24' >
        <div className='text-center text-3xl py-2'>
            <Title text1={'YOU MAY'} text2={"ALSO LIKE"}/>
        </div>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {related.map((item,index)=>(
                    <ProductItem 
                    onClick={() => handleProductClick(item._id)} 
                    className="cursor-pointer"
                    key={index} 
                    id={item._id} 
                    name={item.name} 
                    price={item.price} 
                    image={item.image} />
                ))
            }
        </div>
    </div>
  )
}

export default RelatedProducts