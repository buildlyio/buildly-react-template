import React from "react";
import "./Select.css";
import PropTypes from "prop-types";

const Select = ({
  name,
  size,
  value,
  label,
  options,
  info,
  required,
  onChange,
}) => {
  return (
    <label className={`select-component select-component--${size}`}>
      <span className="label">{label}</span>
      <select
        className="form-select"
        name={name}
        value={value}
        required={required}
        onChange={onChange}
      >
        <option defaultValue>Choose</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="info">{info}</span>
    </label>
  );
};

Select.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(["medium", "large"]),
  value: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  info: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
};

Select.defaultProps = {
  size: "medium",
  label: "Options",
  options: [],
};

export default Select;
