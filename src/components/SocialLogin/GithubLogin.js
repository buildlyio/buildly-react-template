import React, { useRef } from 'react';
import { Button } from '@material-ui/core';
import { GitHub as GitHubIcon } from '@material-ui/icons';
import PopupWindow from './PopupWindow';
import { toQuery } from '@utils/socialLogin';

const GithubLogin = ({ className, clientId, onSuccess, onFailure }) => {
  const popup = useRef(null);

  const onBtnClick = () => {
    const search = toQuery({ client_id: clientId });
    popup.current = PopupWindow.open(
      'github-oauth-authorize',
      `https://github.com/login/oauth/authorize?${search}`,
      { height: 800, width: 600 }
    );

    popup.current.then(
      (data) => localSuccess(data),
      (error) => localFailure(error)
    );
  };

  const localSuccess = (data) => {
    if (!data.code) {
      return localFailure(new Error("'code' not found"));
    }

    onSuccess(data);
  };

  const localFailure = (error) => {
    onFailure(error);
  };

  return (
    <Button
      className={className}
      fullWidth
      variant='contained'
      color='secondary'
      startIcon={<GitHubIcon />}
      onClick={onBtnClick}
    >
      Sign in with Github
    </Button>
  );
};

export default GithubLogin;
