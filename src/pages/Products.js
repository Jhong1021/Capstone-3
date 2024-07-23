import { useEffect, useState, useContext } from 'react';
import UserContext from '../UserContext';
import UserView from '../components/UserView';
import AdminView from '../components/AdminView';


export default function Products() {

  const { user } = useContext(UserContext);

  const [ products, setProducts ] = useState([]);

  const fetchData = () => {


    let fetchUrl = user.isAdmin === true ? `${process.env.REACT_APP_API_BASE_URL}/products/all` : `${process.env.REACT_APP_API_BASE_URL}/products/active`

    fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if(typeof data.message !== 'string') {
        setProducts(data.products);
      } else {
        setProducts([]);
      }
    })

  }

  useEffect(() => {
    
      fetchData();

  },[])

  return (

    user.isAdmin !== true ?
      <UserView productsData={products} />
      :
      <AdminView productsData={products} fetchData={fetchData} />
    

    )

}