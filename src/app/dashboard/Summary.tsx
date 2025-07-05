'use client';
import React from 'react';
import { useQuery } from 'urql';
import { useSession } from 'next-auth/react';

interface Metric {
  title: string;
  value: number;
  bgColor: string;
  textColor: string;
}
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// GraphQL query to get a list of asset values
const GET_Asset_Values = `
  query GetAssetValues($email: String!) {
     user(email: $email){
      asset {
        value
        }
    }
  }
`;

// GraphQL query to get a list of asset values
const GET_Liability_Values = `
  query GetLiabilityValues($email: String!) {
     user(email: $email){
      liability {
        value
        }
    }
  }
`;

export default function Summary() {
  const { data: session, status } = useSession();
  const skip = status === 'loading' || !session?.user?.email;

  // Execute the query to retreive assets
  const [assetResult] = useQuery({
    query: GET_Asset_Values,
    variables: { email: session?.user?.email },
    pause: skip, // Ensure the query runs after the session is ready
  });
  const {
    data: assets,
    fetching: assetfetching,
    error: assetError,
  } = assetResult;
  const totalAssets = assets?.user.asset.reduce(
    (acc: number, asset: { value: string }) => acc + Number(asset.value),
    0,
  );

  // Execute the query to retreive liabilitys
  const [liabilityResult] = useQuery({
    query: GET_Liability_Values,
    variables: { email: session?.user?.email },
    pause: skip,
  });
  const {
    data: liabilities,
    fetching: liabilityfetching,
    error: liabilityError,
  } = liabilityResult;
  const totalLiabilities = liabilities?.user.liability.reduce(
    (acc: number, liability: { value: string }) =>
      acc + Number(liability.value),
    0,
  );

  if (status === 'loading') return <div>Loading session...</div>;
  if (!session?.user?.email) return <div>No user session found.</div>;

  if (assetfetching || liabilityfetching) return <div>Loading data...</div>;
  if (assetError) return <div>Error: {assetError.message}</div>;
  if (liabilityError) return <div>Error: {liabilityError.message}</div>;

  const metrics: Metric[] = [
    {
      title: 'Your Total Networth',
      value: totalAssets - totalLiabilities,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
    },
    {
      title: 'Your Total Assets',
      value: totalAssets,
      bgColor: 'bg-green-600',
      textColor: 'text-white',
    },
    {
      title: 'Your Liabilities',
      value: totalLiabilities,
      bgColor: 'bg-orange-600',
      textColor: 'text-white',
    },
  ];

  return (
    <div className="flex flex-row gap-4 w-full max-w-6xl mx-auto">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`${metric.bgColor} ${metric.textColor} ${index == 0 ? 'flex-2' : 'flex-1'} rounded-sm p-3 content-center`}
        >
          <div className=" flex flex-row flex-wrap items-center justify-between">
            <div>
              <h3 className="text-lg font-medium opacity-90">{metric.title}</h3>
              <p className="text-sm opacity-75">as of today</p>
            </div>
            <p className="text-2xl font-bold tracking-tight">
              {formatCurrency(metric.value)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
