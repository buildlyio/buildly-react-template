import React from "react";
import Button from "react-bootstrap/Button";
import "./Button.css";

interface ButtonProps {
  label: string;
  variant: string;
  btnClicked: Function;
}

const CustomButton = (props: ButtonProps) => {
  console.log("props : ", props);
  return (
    <>
      <Button variant={props.variant} onClick={() => props.btnClicked}>
        {props.label}
      </Button>
    </>
  );
};

export default CustomButton;
