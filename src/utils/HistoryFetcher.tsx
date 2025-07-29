import { useEffect, useRef, useCallback } from 'react';
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
  const client = useClient();
  
  // Use a more stable approach with a single ref for all state
  const stateRef = useRef({
    hasFetched: {
      year: false,
      month: false,
      day: false,
    },
    lastEmail: null as string | null,
    isFetching: false,
    setResultList: setResultList,
  });

  // Update the setResultList reference
  stateRef.current.setResultList = setResultList;

  const fetchData = useCallback(async (email: string) => {
    if (stateRef.current.isFetching) {
      console.log('HistoryFetcher: Already fetching, skipping');
      return;
    }

    console.log('HistoryFetcher: Starting fetch for email:', email, 'timeScale:', timeScale);
    stateRef.current.isFetching = true;

    try {
      // Get the current asset values
      const currentAssetValues = await client
        .query(GET_Current_Asset_Values, {
          email: email,
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
          email: email,
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
      stateRef.current.setResultList((prev) => [
        ...prev,
        {
          date: now,
          networth: currentAssetValue - currentLiabilityValue,
          asset: currentAssetValue,
          liability: currentLiabilityValue,
        },
      ]);

      // Get past values of assets and liabilities
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
              email: email,
              after: date,
            })
            .toPromise();

          if (assetResult.error) {
            console.error('Error fetching data:', assetResult.error);
            break;
          }

          // Get liability data
          const liabilityResult = await client
            .query(GET_Liability_HISTORY, {
              email: email,
              after: date,
            })
            .toPromise();

          if (liabilityResult.error) {
            console.error('Error fetching data:', liabilityResult.error);
            break;
          }

          const assets = assetResult.data?.user?.asset;
          const liabilities = liabilityResult.data?.user?.liability;

          // Aggregate all asset values
          let assetTotal = 0;
          let assetIsFinished = false;
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
          let liabilityIsFinished = false;
          for (let liability of liabilities) {
            if (liability.liabilityHistory[0]) {
              liabilityTotal += Number(liability.liabilityHistory[0].value);
              liabilityIsFinished = false;
            } else {
              liabilityIsFinished = true;
            }
          }

          // When all the data of assets and liabilities are retrieved, exit the loop
          if (assetIsFinished && liabilityIsFinished) break;

          // Format values
          const data = {
            date: date,
            networth: assetTotal - liabilityTotal,
            asset: assetTotal,
            liability: liabilityTotal,
          };

          // Update state with new data
          stateRef.current.setResultList((prev) => [...prev, data]);

          timeScaleOffset += 1;
        } catch (err) {
          console.error('Fetch error:', err);
          break;
        }
      }
      
      console.log('HistoryFetcher: Fetch completed for email:', email, 'timeScale:', timeScale);
    } finally {
      stateRef.current.isFetching = false;
    }
  }, [now, timeScale, client]);

  useEffect(() => {
    const email = session?.user?.email;
    
    if (!email) {
      console.log('HistoryFetcher: No session email, skipping effect');
      return;
    }
    
    // Check if we've already fetched for this email and timeScale
    if (stateRef.current.lastEmail === email && stateRef.current.hasFetched[timeScale]) {
      console.log('HistoryFetcher: Already fetched for this email and timeScale, skipping');
      return;
    }
    
    // Update the last email
    stateRef.current.lastEmail = email;
    
    console.log('HistoryFetcher: Effect triggered for email:', email, 'timeScale:', timeScale);
    
    // Reset fetch state
    stateRef.current.hasFetched = {
      year: false,
      month: false,
      day: false,
    };
    stateRef.current.setResultList([]);
    stateRef.current.hasFetched[timeScale] = true;

    fetchData(email);
  }, [session?.user?.email, timeScale, fetchData]);

  return null;
}
