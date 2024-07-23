import React from 'react';
import { Form } from 'react-bootstrap';

function NumericInput({ value, onChange, min, max }) {
  const handleChange = (e) => {
    const val = e.target.value;
    if ((min !== undefined && val < min) || (max !== undefined && val > max)) {
      return;
    }
    onChange(val);
  };

  const handleKeyDown = (e) => {
    const invalidChars = ['-', '+', 'e', 'E'];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <Form.Control
      type="number"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      min={min}
      max={max}
    />
  );
}

export default NumericInput;
