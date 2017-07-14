import React from 'react';

import Button from './Button';

function SignOut(props) {
  return (
    <Button onClick={props.onSignOut}>Выйти</Button>
  );
}

export default SignOut;