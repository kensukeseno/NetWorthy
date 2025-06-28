'use client'
import { useQuery } from 'urql';

// GraphQL query
const GET_CURRENCIES = `
  query GetCurrencies {
    currnencies {
      id
      code
    }
  }
`;

export default function CurrencyDropdown() {
  const [result] = useQuery({ query: GET_CURRENCIES });
  
  const { data, fetching, error } = result;

  // Handle loading state
  if (fetching) return <div>Loading currencies...</div>;
  
  // Handle error state
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <label htmlFor="currency-select">Select Currency: </label>
      <select id="currency-select" name="currency">
        {data?.currnencies?.map((currency) => (
          <option key={currency.id} value={currency.code}>
            {currency.code}
          </option>
        ))}
      </select>
    </div>
  );
}