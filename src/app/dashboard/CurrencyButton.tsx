'use client';
import { useQuery } from 'urql';
import Select from 'react-select';

// GraphQL query
const GET_CURRENCIES = `
  query GetCurrencies {
    currencies {
      code
      country
    }
  }
`;

export default function CurrencyDropdown() {
  // Execute the query
  const [result] = useQuery({ query: GET_CURRENCIES });

  const { data, fetching, error } = result;

  // Handle loading state
  if (fetching) return <div>Loading currencies...</div>;

  // Handle error state
  if (error) return <div>Error: {error.message}</div>;

  const options = data?.currencies?.map(
    (currency: { code: string; country: string }) => ({
      value: currency.code,
      label: (
        <div className="flex items-center gap-2 ">
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

  return <Select options={options} defaultValue={options[0]} />;
}
