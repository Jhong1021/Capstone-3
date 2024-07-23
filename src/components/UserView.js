import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Row } from 'react-bootstrap';


export default function UserView({productsData}) {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const productsArr = productsData.map(products => {
                    return (
                        <ProductCard productProp={products} key={products._id} />
                    );
               
        })
        setProducts(productsArr)
    }, [productsData])



    return (
        <>
        <h1>Products</h1>
        <Row>
            {products}
        </Row>
        </>
        )

}