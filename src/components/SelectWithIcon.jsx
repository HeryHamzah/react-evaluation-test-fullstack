import React from 'react';
import { PiCaretDown } from 'react-icons/pi';
import './SelectWithIcon.css';

/**
 * Component reusable untuk Select dengan icon PiCaretDown
 * 
 * @param {Object} props
 * @param {string} props.value - Current selected value
 * @param {function} props.onChange - Handler ketika value berubah
 * @param {React.ReactNode} props.children - Option elements
 * @param {string} props.className - Additional CSS classes (optional)
 */
const SelectWithIcon = ({ value, onChange, children, className = '' }) => {
  return (
    <div className="select-wrapper">
      <select
        className={`filter-select ${className}`}
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
      <PiCaretDown className="select-caret" />
    </div>
  );
};

export default SelectWithIcon;
