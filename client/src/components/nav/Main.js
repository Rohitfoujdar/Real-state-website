import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Main() {
  return (
    <div>
      <nav className="nav d-flex justify-content-between p-2 lead">
        <NavLink className="nav-link" aria-current="page" to="/">
          Home
        </NavLink>
        <NavLink className="nav-link" to="/login">
          Login
        </NavLink>
        <NavLink className="nav-link" to="/register">
          Signup
        </NavLink>

        <div>
            <li>
             <Link className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
               User
             </Link>
             <ul className="dropdown-menu">
                <li>
                 <NavLink className="nav-link" to="/dashboard">
                   Dashboard
                 </NavLink>
                </li>
                <Link className="nav-link">Logout</Link>
             </ul>
            </li>
        </div>
      </nav>
    </div>
  );
}
