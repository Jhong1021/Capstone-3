import { useState, useEffect, useContext } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import UserContext from '../UserContext';
import { useNavigate, Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Register() {

	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [mobileNo, setMobileNo] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isActive, setIsActive] = useState(false);

	function registerUser(e) {
		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_BASE_URL}/users/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobileNo: mobileNo,
				password: password
			})
		})
			.then(res => res.json())
			.then(data => {
				if (data.message === 'Registered Successfully') {
					setFirstName("");
					setLastName("");
					setEmail("");
					setMobileNo("");
					setPassword("");
					setConfirmPassword("");

					Swal.fire({
						title: "Registration Successful",
						icon: "success",
						text: "Thank you for registering!"
					});
					navigate("/login");

				} else if (data.error === 'Duplicate Email') {
					Swal.fire({
						title: "Duplicate Email",
						icon: "error"
					});
				} else if (data.error === 'Mobile number invalid') {
					Swal.fire({
						title: "Mobile number invalid",
						icon: "error"
					});
				} else if (data.error === 'Password must be at least 8 characters') {
					Swal.fire({
						title: "Password must be at least 8 characters",
						icon: "error"
					});
				} else {
					Swal.fire({
						title: "Something went wrong!",
						icon: "error"
					});
				}
			})
	}

	useEffect(() => {
		if ((firstName !== "" && lastName !== "" && mobileNo !== "" && email !== "" && password !== "" && confirmPassword !== "") && (mobileNo.length === 11) && (password === confirmPassword)) {
			setIsActive(true);
		} else {
			setIsActive(false);
		}
	}, [firstName, lastName, email, mobileNo, password, confirmPassword])

	return (
		user.id !== null?
        <Navigate to="/" />
    :
			<Form onSubmit={e => registerUser(e)}>
			 <h1 className="my-5 text-center">Register</h1>
			 {/*Two way data binding*/}
		      <Form.Group>
		        <Form.Label>First Name:</Form.Label>
		        <Form.Control type="text" placeholder="Enter First Name" value={firstName} onChange={e => {setFirstName(e.target.value)}} required/>
		      </Form.Group>

		      <Form.Group>
		        <Form.Label>Last Name:</Form.Label>
		        <Form.Control type="text" placeholder="Enter Last Name" value={lastName} onChange={e => {setLastName(e.target.value)}} required/>
		      </Form.Group>

		      <Form.Group>
		        <Form.Label>Email:</Form.Label>
		        <Form.Control type="text" placeholder="Enter Email Name" value={email} onChange={e => {setEmail(e.target.value)}} required/>
		      </Form.Group>

		      <Form.Group>
		        <Form.Label>Mobile Number:</Form.Label>
		        <Form.Control type="text" placeholder="Enter 11 digit Mobile No." value={mobileNo} onChange={e => {setMobileNo(e.target.value)}} required/>
		      </Form.Group>

		       <Form.Group>
		        <Form.Label>Password:</Form.Label>
		        <Form.Control type="password" placeholder="Enter Password" value={password} onChange={e => {setPassword(e.target.value)}} required/>
		      </Form.Group>

		      <Form.Group>
		        <Form.Label>Confirm Password</Form.Label>
		        <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}} required/>
		      </Form.Group>

		      {
		      	isActive?
			      <Button variant="primary" type="submit" className="my-3">Submit</Button>
			      :
			      <Button variant="danger" type="submit" className="my-3" disabled>Submit</Button>
		       }
		    </Form>
		)
}