import React from 'react';

function SignOut(props) {
  return (
    <p>
      <button onClick={props.onSignOut}>Logout</button>
    </p>
  );
}

export default SignOut;