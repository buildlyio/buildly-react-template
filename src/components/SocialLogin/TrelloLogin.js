import React, { useRef } from 'react';
import { Button } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import { socialLogin } from '@redux/authuser/actions/authuser.actions';
import { providers, toQuery } from '@utils/socialLogin';
import PopupWindow from './PopupWindow';

const TrelloLogin = ({ dispatch, history, disabled }) => {
  const popup = useRef(null);

  const onBtnClick = () => {
    const search = toQuery({ key: window.env.TRELLO_API_KEY });
    popup.current = PopupWindow.open(
      'trello-oauth-authorize',
      `https://trello.com/1/authorize?expiration=never&scope=read,write,account&response_type=token&name=Release-Management&${search}`,
      { height: 800, width: 600 },
    );

    popup.current.then(
      (data) => onSuccess(data),
      (error) => onFailure(error),
    );
  };

  // eslint-disable-next-line consistent-return
  const onSuccess = (data) => {
    if (!data.code) {
      return onFailure(new Error("'code' not found"));
    }

    dispatch(socialLogin(data.code, providers.trello, history));
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
      Sign in with Trello
    </Button>
  );
};

export default TrelloLogin;
