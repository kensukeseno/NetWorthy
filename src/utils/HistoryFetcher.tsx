import { useEffect, useRef } from 'react';
import { useClient } from 'urql';
import { Session } from 'next-auth';

interface SingleHistoryType {
  date: Date;
  networth: number;
  asset: number;
  liability: number;
}

interface HistoryFetcherProps {
  session: Session | null;
  now: Date;
  setResultList: React.Dispatch<React.SetStateAction<SingleHistoryType[]>>;
  timeScale: 'year' | 'month' | 'day';
}

const GET_Current_Asset_Values = `
  query GetCurrentValues($email: String!) {
     user(email: $email){
      asset {
        value
        }
    }
  }
`;

const GET_Asset_HISTORY = `
  query GetHistory($email: String!, $after: DateTime!) {
    user(email: $email) {
      asset{
        assetHistory(after: $after){
          value
        }
      }
    }
  }
`;

const GET_Current_Liability_Values = `
  query GetCurrentValues($email: String!) {
     user(email: $email){
      liability {
        value
        }
    }
  }
`;

const GET_Liability_HISTORY = `
  query GetHistory($email: String!, $after: DateTime!) {
    user(email: $email) {
      liability{
        liabilityHistory(after: $after){
          value
        }
      }
    }
  }
`;

export default function HistoryFetcher({
  session,
  now,
  setResultList,
  timeScale,
}: HistoryFetcherProps) {
  // GraphQL client (Data is fetched manually hereuseQuery cannot be used because data fetching here is dynamic)
  const client = useClient();
  const hasFetchedRef = useRef<Record<'year' | 'month' | 'day', boolean>>({
    year: false,
    month: false,
    day: false,
  });

  useEffect(() => {
    if (!session?.user?.email) return;
    if (hasFetchedRef.current[timeScale]) return; // prevent double-run under development environment
    // refresh the result set
    hasFetchedRef.current = {
      year: false,
      month: false,
      day: false,
    };
    setResultList([]);
    hasFetchedRef.current[timeScale] = true;

    const fetchData = async () => {
      // Get the current asset values
      const currentAssetValues = await client
        .query(GET_Current_Asset_Values, {
          email: session.user?.email,
        })
        .toPromise();

      if (currentAssetValues.error) {
        console.error('Error fetching data:', currentAssetValues.error);
        return;
      }

      const currentAssetValue = currentAssetValues.data.user.asset.reduce(
        (acc: number, account: { value: string }) =>
          acc + Number(account.value),
        0,
      );

      // Get the current liability values
      const currentLiabilityValues = await client
        .query(GET_Current_Liability_Values, {
          email: session.user?.email,
        })
        .toPromise();

      if (currentLiabilityValues.error) {
        console.error('Error fetching data:', currentLiabilityValues.error);
        return;
      }

      const currentLiabilityValue =
        currentLiabilityValues.data.user.liability.reduce(
          (acc: number, account: { value: string }) =>
            acc + Number(account.value),
          0,
        );

      // Update result list with the current values of assets and liabilities
      setResultList((prev) => [
        ...prev,
        {
          date: now,
          networth: currentAssetValue - currentLiabilityValue,
          asset: currentAssetValue,
          liability: currentLiabilityValue,
        },
      ]);

      // Get past values of assets and liabilities
      // by going back in time until there's no more data available.

      // Start dates:
      //    (Yearly fetching) January 1st of the current year
      //    (Monthly fetching) 1st of the current month
      //    (Daily fetching) a day before of the current day,
      const startDate = new Date(now);
      if (timeScale === 'year') {
        startDate.setDate(1);
        startDate.setMonth(1);
      } else if (timeScale === 'month') {
        startDate.setDate(1);
      } else {
        startDate.setDate(startDate.getDate() - 1);
      }

      let timeScaleOffset = 0;
      while (true) {
        const date = new Date(startDate);
        if (timeScale === 'year') {
          date.setFullYear(date.getFullYear() - timeScaleOffset);
        } else if (timeScale === 'month') {
          date.setMonth(date.getMonth() - timeScaleOffset);
        } else {
          date.setDate(date.getDate() - timeScaleOffset);
        }

        try {
          // Get asset data
          const assetResult = await client
            .query(GET_Asset_HISTORY, {
              email: session.user?.email,
              after: date,
            })
            .toPromise(); // Convert to promise to use async/await

          if (assetResult.error) {
            console.error('Error fetching data:', assetResult.error);
            break;
          }

          // Get liability data
          const liabilityResult = await client
            .query(GET_Liability_HISTORY, {
              email: session.user?.email,
              after: date,
            })
            .toPromise(); // Convert to promise to use async/await

          if (liabilityResult.error) {
            console.error('Error fetching data:', liabilityResult.error);
            break;
          }

          const assets = assetResult.data?.user?.asset;
          const liabilities = liabilityResult.data?.user?.liability;

          // Aggregate all asset values
          let assetTotal = 0;
          let assetIsFinished = false; // Flag to indicate whether there are more assets
          for (let asset of assets) {
            if (asset.assetHistory[0]) {
              assetTotal += Number(asset.assetHistory[0].value);
              assetIsFinished = false;
            } else {
              assetIsFinished = true;
            }
          }

          // Aggregate all liability values
          let liabilityTotal = 0;
          let liabilityIsFinished = false; // Flag to indicate whether there are more liabilities
          for (let liability of liabilities) {
            if (liability.liabilityHistory[0]) {
              liabilityTotal += Number(liability.liabilityHistory[0].value);
              liabilityIsFinished = false;
            } else {
              liabilityIsFinished = true;
            }
          }

          // When all the data of assets and liabilities are retreived, exit the loop
          if (assetIsFinished && liabilityIsFinished) break;

          // Format values
          const data = {
            date: date,
            networth: assetTotal - liabilityTotal,
            asset: assetTotal,
            liability: liabilityTotal,
          };

          // Update state with new data
          setResultList((prev) => [...prev, data]);

          timeScaleOffset += 1;
        } catch (err) {
          console.error('Fetch error:', err);
          break;
        }
      }
    };

    fetchData(); // Call the fetch function
  }, [session, timeScale]); // Run when session is available or time scale changes
}
