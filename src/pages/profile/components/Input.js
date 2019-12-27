import React from 'react';

export default ({ callback, value, placeholder, type = 'text', margin = '15px 0', width = '40%' }) => {
  const style = {
    margin,
    width,
  };

  return (
    <input
      className='form-control'
      type={type} placeholder={placeholder}
      style={style}
      value={value()}
      onChange={(e) => callback(e.target.value, placeholder)}
    />
  );
}
