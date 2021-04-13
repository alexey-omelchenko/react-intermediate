import React from 'react';
import { NavLink } from 'react-router-dom';

import './nav.scss';

const Nav = () => (
  <div className="row">
    <div className="col">
      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <NavLink to="/" className="nav-link" activeClassName="active" exact>
            Game
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/about" className="nav-link" activeClassName="active">
            About
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
);

export default Nav;
