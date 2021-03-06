import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import isEmail from "../../tools/isEmail";
import isUsername from "../../tools/isUsername";
import isName from "../../tools/isName";
import isPassword from "../../tools/isPassword";
import { Link } from "react-router-dom";

function Register() {
  const [username, setusername] = useState("");
  const [errusername, seterrusername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [errfirstname, seterrfirstname] = useState("");
  const [lastname, setlastname] = useState("");
  const [errlastname, seterrlastname] = useState("");
  const [email, setemail] = useState("");
  const [erremail, seterremail] = useState("");
  const [password, setpassword] = useState("");
  const [errpassword, seterrpassword] = useState("");
  const [verifypassword, setverifypassword] = useState("");
  const [errverifypassword, seterrverifypassword] = useState("");
  const history = useHistory();
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) history.push("/");
    // eslint-disable-next-line
  }, [token]);

  useEffect(() => {
    if (firstname && !isName(firstname) && firstname.length < 24)
      seterrfirstname("First name is not valide (minimum is 3 letters)");
    else if (firstname.length > 24) seterrfirstname("First name is too long (maximum is 24 letters)");
    else seterrfirstname("");
    if (lastname && !isName(lastname) && lastname.length < 24)
      seterrlastname("Last Name is not valide (minimum is 3 letters)");
    else if (lastname.length > 24) seterrlastname("Last name is too long (maximum is 24 letters)");
    else seterrlastname("");
    if (username && !isUsername(username) && username.length < 24)
      seterrusername("Username is not valide (minimum is 3 characters)");
    else if (username.length > 24) seterrusername("Username is too long (maximum is 24 characters)");
    else seterrusername("");
    if (email && !isEmail(email)) seterremail("Email is not valide");
    else seterremail("");
    if (password && !isPassword(password))
      seterrpassword(
        "Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
      );
    else seterrpassword("");
    if (verifypassword && password !== verifypassword) seterrverifypassword("Verify Password is not valide");
    else seterrverifypassword("");
  }, [firstname, lastname, username, email, password, verifypassword]);

  const handelRegister = () => {
    if (!firstname) seterrfirstname("First name should not be empty");

    if (!lastname) seterrlastname("Last name should not be empty");

    if (!username) seterrusername("Username should not be empty");

    if (!email) seterremail("Email should not be empty");

    if (!password) seterrpassword("Password should not be empty");

    if (!verifypassword) seterrverifypassword("Verify Password should not be empty");

    if (
      username &&
      firstname &&
      lastname &&
      email &&
      password &&
      verifypassword === password &&
      !errusername &&
      !errfirstname &&
      !errlastname &&
      !erremail &&
      !errpassword &&
      !errverifypassword
    ) {
      Axios.post("http://localhost:3001/register", {
        firstname: firstname,
        lastname: lastname,
        username: username,
        email: email,
        password: password,
      })
        .then((res) => {
          if (res.data.message === "Email and or username are already used") {
            Swal.fire({
              icon: "error",
              text: "Email and or username are already used please try with another one ",
              showConfirmButton: false,
              heightAuto: false,
            });
          } else {
            Swal.fire({
              icon: "success",
              text: "You Are Now Registered Please Check Your Email To Confirm Your Account! ",
              showConfirmButton: false,
              heightAuto: false,
            });
            history.push("/login");
          }
        })
        .catch((err) => {
          // console.log(err)
        });
    }
  };

  return (
    <div className="box-form">
      <div className="left">
        <div className="overlay">
          <h1 className="fgp">Find Your Perfect Match</h1>
          <br />
          <p>
            We are here to build emotion, connect people and create happy stories. Online dating sites are the way to go
            for people seeking love.
            <br />
            <br />
            Get to know more
            <Link className="about" to="/about">
              {" "}
              &nbsp;About&nbsp;{" "}
            </Link>
            us.
          </p>
        </div>
      </div>

      <div className="right">
        <h5>Create Account</h5>
        <p>
          Already have an account?{" "}
          <Link className="decoration" to="/login">
            Log in
          </Link>
        </p>
        <div className="inputs">
          <input
            className="inpt"
            type="text"
            placeholder="First name"
            value={firstname}
            onChange={(e) => {
              setfirstname(e.target.value);
            }}
          />
          <span className="errors">{errfirstname}</span>
          <br />
          <input
            className="inpt"
            type="text"
            placeholder="Last name"
            value={lastname}
            onChange={(e) => {
              setlastname(e.target.value);
            }}
          />
          <span className="errors">{errlastname}</span> <br />
          <input
            className="inpt"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setusername(e.target.value);
            }}
          />
          <span className="errors">{errusername}</span>
          <br />
          <input
            className="inpt"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />
          <span className="errors">{erremail}</span>
          <br />
          <input
            className="inpt"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          <span className="errors">{errpassword}</span> <br />
          <input
            className="inpt"
            type="password"
            placeholder="Verify Password"
            value={verifypassword}
            onChange={(e) => {
              setverifypassword(e.target.value);
            }}
          />
          <span className="errors">{errverifypassword}</span>
        </div>
        <br />
        <br />
        <button className="btn" onClick={() => handelRegister()}>
          Register
        </button>
      </div>
    </div>
  );
}
export default Register;
