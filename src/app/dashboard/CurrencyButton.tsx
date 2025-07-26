'use client';
import { useQuery } from 'urql';
import Select from 'react-select';
import Freecurrencyapi from '@everapi/freecurrencyapi-js';
import { useState } from 'react';

// GraphQL query
const GET_CURRENCIES = `
  query GetCurrencies {
    currencies {
      code
      country
    }
  }
`;

// Debug: Check if API key is loaded
console.log('API Key loaded:', process.env.NEXT_PUBLIC_FREECURRENCY_API_KEY ? 'Yes' : 'No');

// Initialize the API with your API key from environment variables
const apiKey = process.env.NEXT_PUBLIC_FREECURRENCY_API_KEY;

if (!apiKey) {
  console.error('NEXT_PUBLIC_FREECURRENCY_API_KEY is not set in environment variables');
}

const freecurrencyapi = new Freecurrencyapi(apiKey || '');

export default function CurrencyDropdown() {
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  
  // Execute the query
  const [result] = useQuery({ query: GET_CURRENCIES });
  const { data, fetching, error } = result;

  // Function to fetch and log currency rates
  const fetchCurrencyRates = async (baseCurrency: string) => {
    try {
      const response = await freecurrencyapi.latest({
        base_currency: baseCurrency,
        currencies: 'USD,EUR,GBP,JPY,AUD,CAD,CHF,CNY,SEK,NOK,MXN,SGD,HKD,KRW,TRY,RUB,INR,BRL,ZAR'
      });
      
      console.log(`Currency rates for ${baseCurrency}:`, response);
      return response;
    } catch (error) {
      console.error('Error fetching currency rates:', error);
    }
  };

  // Handle currency selection change
  const handleCurrencyChange = (selectedOption: any) => {
    if (selectedOption) {
      const newCurrency = selectedOption.value;
      setSelectedCurrency(newCurrency);
      
      // Fetch and log rates for the selected currency
      fetchCurrencyRates(newCurrency);
    }
  };

  // Handle loading state
  if (fetching) return <div>Loading currencies...</div>;
  
  // Handle error state
  if (error) return <div>Error: {error.message}</div>;

  const options = data?.currencies?.map(
    (currency: { code: string; country: string }) => ({
      value: currency.code,
      label: (
        <div className="flex items-center gap-2">
          <img
            src={`https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/${currency.country}.svg`}
            alt={currency.code}
            className="w-4 h-4"
          />
          <span>{currency.code}</span>
        </div>
      ),
    }),
  );

  return (
    <Select 
      options={options} 
      defaultValue={options?.[0]} 
      onChange={handleCurrencyChange}
    />
  );
}