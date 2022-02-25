import React, { useState } from "react";
import "../App.css";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PhoneSignUp = () => {
  const [number, setNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [flag, setFlag] = useState(false);

  const [confirmObj, setConfirmObj] = useState("");

  const { setUpRecaptcha } = useAuth();

  const history = useHistory();

  const getOtpHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (number === "" || number === undefined) {
      return setError("Please Enter Valid Phone Number");
    }

    try {
      const response = await setUpRecaptcha(number);
      console.log(response);
      setConfirmObj(response);
      setFlag(true);
    } catch (err) {
      setError(err.error);
    }
  };

  const verifyOtpHandler = async (e) => {
    e.preventDefault();

    if (otp === "" || otp === undefined) return;

    try {
      setError("");
      await confirmObj.confirm(otp);
      history.push("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Register With Phone Number</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form
            onSubmit={getOtpHandler}
            style={{ display: !flag ? "block" : "none" }}
          >
            <Form.Group id="getOtp">
              <Form.Label>Phone Number</Form.Label>
              <PhoneInput
                defaultCountry="IN"
                value={number}
                onChange={setNumber}
                placeholder="Enter Your Phone Number"
              />
              <div id="recaptcha-container" />
            </Form.Group>

            <Button className="w-100 mt-2" variant="primary" type="submit">
              Send OTP
            </Button>
            <Link to="/">
              <Button className="w-100 mt-2" variant="secondary">
                Cancel
              </Button>
            </Link>
          </Form>

          <Form
            onSubmit={verifyOtpHandler}
            style={{ display: flag ? "block" : "none" }}
          >
            <Form.Group id="verifyOtp">
              <Form.Label>Your Received OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Your Received OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </Form.Group>

            <Button className="w-100 mt-2" variant="primary" type="submit">
              Verify OTP
            </Button>
            <Link to="/">
              <Button className="w-100 mt-2" variant="secondary">
                Cancel
              </Button>
            </Link>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default PhoneSignUp;
