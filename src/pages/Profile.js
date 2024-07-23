import { useState, useEffect, useContext } from 'react';
import { Row, Col}  from 'react-bootstrap';
import UserContext from '../UserContext';
import { useNavigate, Navigate } from 'react-router-dom';
import ResetPassword from '../components/ResetPassword';

export default function Profile(){

    const { user } = useContext(UserContext);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');

     useEffect(() => {

        fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(res => res.json())
        .then(data => {

            setFirstName(data.user.firstName);
            setLastName(data.user.lastName);
            setMobileNo(data.user.mobileNo);
            setEmail(data.user.email);
        })
    });

    return (
        (user.id === null) ?
          <Navigate to="/products" />
        :
        <>
          <Row>
              <Col className="p-5 bg-primary text-white">
                  <h1 className="my-5 ">Profile</h1>
                  <h2 className="mt-3">{`${firstName} ${lastName}`}</h2>
                  <hr />
                  <h4>Contacts</h4>
                  <ul>
                      <li>{email}</li>
                      <li>{mobileNo}</li>
                  </ul>
              </Col>
          </Row>
          <Row>
            <Col>
              <ResetPassword />
            </Col>
          </Row>
        </>
    )
}