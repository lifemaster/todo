import React from 'react';
import PropTypes from 'prop-types';

function Header(props) {
  return (
    <header>
      <h1>{props.title}</h1>
      {props.element}
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  element: PropTypes.element
}

export default Header;