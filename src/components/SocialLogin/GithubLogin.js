import React, { useRef } from 'react';
import { Button } from '@material-ui/core';
import { GitHub as GitHubIcon } from '@material-ui/icons';
import { socialLogin } from '@redux/authuser/actions/authuser.actions';
import { providers, toQuery } from '@utils/socialLogin';
import PopupWindow from './PopupWindow';

const GithubLogin = ({ dispatch, history, disabled }) => {
  const popup = useRef(null);

  const onBtnClick = () => {
    const search = toQuery({ client_id: window.env.GITHUB_CLIENT_ID });
    popup.current = PopupWindow.open(
      'github-oauth-authorize',
      `https://github.com/login/oauth/authorize?${search}`,
      { height: 800, width: 600 },
    );

    popup.current.then(
      (data) => onSuccess(data),
      (error) => onFailure(error),
    );
  };

  const onSuccess = (data) => {
    if (!data.code) {
      return onFailure(new Error("'code' not found"));
    }
    console.log('Data: ', data)
    dispatch(socialLogin(data.code, providers.github, history));
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return (
    <Button
      fullWidth
      variant="contained"
      color="secondary"
      startIcon={<GitHubIcon />}
      onClick={onBtnClick}
      disabled={Boolean(disabled)}
    >
      Sign in with Github
    </Button>
  );
};

export default GithubLogin;
