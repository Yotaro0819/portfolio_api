import React from 'react';


const PriceInput = ({ value, onChange }) => {
  
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const sanitizedValue = newValue ? parseInt(newValue, 10) : '';
    onChange(sanitizedValue);
  };

  return (
    <div className="price-input text-center">

      <p className="p-2 btn inline">¥
        <input
          type="number"
          // これやらないと0が残っちゃう
          value={value === '' ? '' : value}
          onChange={handleInputChange}
          className="btn text-white bg-gray-800 input-price"
          placeholder="Price"
        />
      </p>

    </div>
  );
};

export default PriceInput;
