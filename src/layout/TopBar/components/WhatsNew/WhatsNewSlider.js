import React, { forwardRef } from 'react';
import _ from 'lodash';
import { Dialog, DialogContent, Slide } from '@mui/material';
import { isTablet } from '@utils/mediaQuery';
import '../../TopBarStyles.css';
import WhatsNewHeader from './WhatsNewHeader';
import WhatsNewContent from './WhatsNewContent';

const Transition = forwardRef((props, ref) => <Slide direction="left" ref={ref} {...props} />);

export default function WhatsNewSlider({ open, setOpen, data }) {
  const closeWhatsNew = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={closeWhatsNew}
      fullWidth
      fullScreen={isTablet()}
      aria-labelledby="whats-new"
      TransitionComponent={Transition}
      className="whatsNewDialog"
    >
      <WhatsNewHeader closeIcon closeOnClick={closeWhatsNew} />
      <DialogContent className="whatsNewDialogContent">
        <WhatsNewContent data={data} />
      </DialogContent>
    </Dialog>
  );
}
