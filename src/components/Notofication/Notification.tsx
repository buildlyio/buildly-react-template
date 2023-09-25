import "./Notification.css";
import Alert from "react-bootstrap/Alert";
import PropTypes from "prop-types";

const Notification = ({ variant, message }: any) => {
  return (
    <Alert key={variant} variant={variant}>
      <>{message}</>
    </Alert>
  );
};

Notification.propTypes = {
  variant: PropTypes.string.isRequired,
  message: PropTypes.array.isRequired,
};

// function BasicExample() {
//     return (
//         <>
//             {[
//                 'primary',
//                 'secondary',
//                 'success',
//                 'danger',
//                 'warning',
//                 'info',
//                 'light',
//                 'dark',
//             ].map((variant) => (
//                 <Alert key={variant} variant={variant}>
//                     This is a {variant} alert—check it out!
//                 </Alert>
//             ))}
//         </>
//     );
// }

export default Notification;
