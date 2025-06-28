'use client'
import { useQuery } from 'urql';
import { useState } from 'react';

// GraphQL query
const GET_CURRENCIES = `
  query GetCurrencies {
    currnencies {
      id
      code
    }
  }
`;

// Map currency codes to country codes
const currencyToCountry = {
  'USD': 'us', 'EUR': 'eu', 'JPY': 'jp', 'GBP': 'gb', 'AUD': 'au',
  'CAD': 'ca', 'CHF': 'ch', 'CNY': 'cn', 'HKD': 'hk', 'NZD': 'nz',
  'SEK': 'se', 'KRW': 'kr', 'SGD': 'sg', 'NOK': 'no', 'MXN': 'mx',
  'INR': 'in', 'RUB': 'ru', 'ZAR': 'za', 'BRL': 'br', 'TRY': 'tr'
};

export default function CurrencyDropdown() {
  const [selectedCurrency, setSelectedCurrency] = useState('');
  
  // Execute the query
  const [result] = useQuery({ query: GET_CURRENCIES });
  
  const { data, fetching, error } = result;

  // Handle loading state
  if (fetching) return <div>Loading currencies...</div>;
  
  // Handle error state
  if (error) return <div>Error: {error.message}</div>;

  const handleCurrencyChange = (e) => {
    setSelectedCurrency(e.target.value);
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <select 
          id="currency-select" 
          name="currency" 
          value={selectedCurrency}
          onChange={handleCurrencyChange}
          style={{ 
            padding: '12px 16px 12px 45px',
            fontSize: '16px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: 'white',
            minWidth: '200px',
            cursor: 'pointer',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
            backgroundPosition: 'right 12px center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '16px'
          }}
        >
          {data?.currnencies?.map((currency) => {
            return (
              <option key={currency.id} value={currency.code}>
                {currency.code}
              </option>
            );
          })}
        </select>
        
        {/* Flag overlay */}
        {selectedCurrency && (
          <img
            src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${currencyToCountry[selectedCurrency]}.svg`}
            alt={`${selectedCurrency} flag`}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '20px',
              height: '15px',
              borderRadius: '2px',
              objectFit: 'cover',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    </div>
  );
}