import React from 'react';

import Button from './Button';

function SignOut(props) {
  return (
    <Button onClick={props.onSignOut}>Logout</Button>
  );
}

export default SignOut;