import React, { useState} from "react";
import { useNavigate } from "react-router-dom";

import { accountService } from "@/_services";

import "./auth.css";

const Login = () => {
   let navigate = useNavigate();

   const [credentials, setCredentials] = useState({
      email: "clavin@example.com",
      password: "password12",
   });

   const onChange = (e) => {
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
   };

   const onSubmit = (e) => {
      e.preventDefault();
         accountService.login(credentials)
         .then((res) => {
            console.log(res);
            accountService.saveToken(res.data.access_token);
            navigate("/admin");
         })
         .catch((err) => console.log(err));
   };

   return (
      <form onSubmit={onSubmit}>
         <div className="group">
            <label htmlFor="login">Identifiant</label>
            <input
               type="text"
               name="email"
               value={credentials.email}
               onChange={onChange}
            />
         </div>
         <div className="group">
            <label htmlFor="password">mot de passe</label>
            <input
               type="text"
               name="password"
               value={credentials.password}
               onChange={onChange}
            />
         </div>
         <div className="group">
            <button type="">Connection</button>
         </div>
      </form>
   );
};

export default Login;
