'use client';
import Summary from '@/app/dashboard/Summary';
import Graph from '@/app/dashboard/Graph';
import CurrencyButton from '@/app/dashboard/CurrencyButton';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { DatePick } from './DatePicker';
import { useSession } from 'next-auth/react';
import { useClient } from 'urql';

interface SingleHistoryType {
  date: Date;
  networth: number;
  asset: number;
  liability: number;
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

export default function DashBoard() {
  const { data: session } = useSession();
  const client = useClient();

  // Use a ref to store the current time to ensure it never changes
  const nowRef = useRef(new Date());
  const now = nowRef.current;

  const [resultList, setResultList] = useState<SingleHistoryType[]>([]);

  const [xMax, setXMax] = useState<Date>(now);
  const [xMin, setXMin] = useState<Date>(
    new Date(now.getTime() - 1000 * 60 * 60 * 24 * 365), // By default, the graph shows one year of data
  );
  const [dataset, setDataset] = useState<
    'all' | 'networth' | 'asset' | 'liability'
  >('all'); // By default, the graph shows all dataset

  const [timeScale, setTimeScale] = useState<'year' | 'month' | 'day'>('month'); // By default, data is retreived monthly

  // Track fetch state
  const fetchStateRef = useRef({
    hasFetched: {
      year: false,
      month: false,
      day: false,
    },
    lastEmail: null as string | null,
    isFetching: false,
  });

  const fetchData = useCallback(async (email: string) => {
    if (fetchStateRef.current.isFetching) {
      console.log('Dashboard: Already fetching, skipping');
      return;
    }

    console.log('Dashboard: Starting fetch for email:', email, 'timeScale:', timeScale);
    fetchStateRef.current.isFetching = true;

    try {
      // Get the current asset values
      const currentAssetValues = await client
        .query(GET_Current_Asset_Values, {
          email: email,
        })
        .toPromise();

      if (currentAssetValues.error) {
        console.error('Error fetching asset data:', currentAssetValues.error);
        return;
      }

      // Check if user has any assets
      if (!currentAssetValues.data?.user?.asset || currentAssetValues.data.user.asset.length === 0) {
        console.log('Dashboard: No assets found for user:', email);
        // Set empty result for current date
        setResultList([{
          date: now,
          networth: 0,
          asset: 0,
          liability: 0,
        }]);
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
        console.error('Error fetching liability data:', currentLiabilityValues.error);
        return;
      }

      // Check if user has any liabilities
      if (!currentLiabilityValues.data?.user?.liability || currentLiabilityValues.data.user.liability.length === 0) {
        console.log('Dashboard: No liabilities found for user:', email);
        // Set result with only assets
        setResultList([{
          date: now,
          networth: currentAssetValue,
          asset: currentAssetValue,
          liability: 0,
        }]);
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
      let hasHistoricalData = false;
      
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
            console.error('Error fetching asset history:', assetResult.error);
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
            console.error('Error fetching liability history:', liabilityResult.error);
            break;
          }

          const assets = assetResult.data?.user?.asset;
          const liabilities = liabilityResult.data?.user?.liability;

          // Check if we have any data at all
          if (!assets || assets.length === 0) {
            console.log('Dashboard: No asset history found for date:', date);
            break;
          }

          // Aggregate all asset values
          let assetTotal = 0;
          let assetIsFinished = false;
          let hasAssetData = false;
          
          for (let asset of assets) {
            if (asset.assetHistory && asset.assetHistory.length > 0 && asset.assetHistory[0]) {
              assetTotal += Number(asset.assetHistory[0].value);
              assetIsFinished = false;
              hasAssetData = true;
            } else {
              assetIsFinished = true;
            }
          }

          // Aggregate all liability values
          let liabilityTotal = 0;
          let liabilityIsFinished = false;
          let hasLiabilityData = false;
          
          for (let liability of liabilities) {
            if (liability.liabilityHistory && liability.liabilityHistory.length > 0 && liability.liabilityHistory[0]) {
              liabilityTotal += Number(liability.liabilityHistory[0].value);
              liabilityIsFinished = false;
              hasLiabilityData = true;
            } else {
              liabilityIsFinished = true;
            }
          }

          // If we have any data for this date, add it
          if (hasAssetData || hasLiabilityData) {
            hasHistoricalData = true;
            const data = {
              date: date,
              networth: assetTotal - liabilityTotal,
              asset: assetTotal,
              liability: liabilityTotal,
            };

            // Update state with new data
            setResultList((prev) => [...prev, data]);
          }

          // When all the data of assets and liabilities are retrieved, exit the loop
          if (assetIsFinished && liabilityIsFinished) break;

          timeScaleOffset += 1;
        } catch (err) {
          console.error('Fetch error:', err);
          break;
        }
      }
      
      // If no historical data was found, we still have the current data
      if (!hasHistoricalData) {
        console.log('Dashboard: No historical data found for user:', email);
      }
      
      console.log('Dashboard: Fetch completed for email:', email, 'timeScale:', timeScale);
    } catch (error) {
      console.error('Dashboard: Unexpected error during fetch:', error);
    } finally {
      fetchStateRef.current.isFetching = false;
    }
  }, [now, timeScale, client]);

  // Effect to handle data fetching
  useEffect(() => {
    const email = session?.user?.email;
    
    if (!email) {
      console.log('Dashboard: No session email, skipping effect');
      return;
    }
    
    // Check if we've already fetched for this email and timeScale
    if (fetchStateRef.current.lastEmail === email && fetchStateRef.current.hasFetched[timeScale]) {
      console.log('Dashboard: Already fetched for this email and timeScale, skipping');
      return;
    }
    
    // Add a small delay to ensure session is stable and prevent rapid re-fetches
    const timeoutId = setTimeout(() => {
      // Double-check that session is still valid
      if (!session?.user?.email || session.user.email !== email) {
        console.log('Dashboard: Session changed during timeout, skipping');
        return;
      }
      
      // Update the last email
      fetchStateRef.current.lastEmail = email;
      
      console.log('Dashboard: Effect triggered for email:', email, 'timeScale:', timeScale);
      
      // Reset fetch state
      fetchStateRef.current.hasFetched = {
        year: false,
        month: false,
        day: false,
      };
      setResultList([]);
      fetchStateRef.current.hasFetched[timeScale] = true;

      fetchData(email);
    }, 200); // 200ms delay to ensure session stability

    return () => clearTimeout(timeoutId);
  }, [session?.user?.email, timeScale, fetchData]);

  const handlePeriodChange = useCallback((period: 'year' | 'month' | 'day') => {
    console.log(period);
    setTimeScale(period);
    switch (period) {
      case 'month':
        setXMin(new Date(xMax.getTime() - 1000 * 60 * 60 * 24 * 365)); // Shows 1 year
        break;
      case 'year':
        setXMin(new Date(xMax.getTime() - 1000 * 60 * 60 * 24 * 365 * 5)); // Shows 5 years
        break;
      case 'day':
        setXMin(new Date(xMax.getTime() - 1000 * 60 * 60 * 24 * 30)); // Shows 1 month
        break;
    }
  }, [xMax]);

  return (
    <div className="flex flex-col gap-5 mt-5">
      <Summary />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-2">
          <DatePick
            setXMax={setXMax}
            setXMin={setXMin}
            xMax={xMax}
            xMin={xMin}
          />
          <select
            onChange={(e) =>
              handlePeriodChange(e.target.value as 'year' | 'month' | 'day')
            }
            defaultValue={'month'}
            className="p-1 border-2 border-gray-200 rounded-md"
          >
            <option value="year">Yearly</option>
            <option value="month">Monthly</option>
            <option value="day">Daily</option>
          </select>
          <select
            onChange={(e) =>
              setDataset(
                e.target.value as 'all' | 'networth' | 'asset' | 'liability',
              )
            }
            className="p-1 border-2 border-gray-200 rounded-md"
          >
            <option value="all">All Net Worth</option>
            <option value="networth">Total Networth</option>
            <option value="asset">Total Assets</option>
            <option value="liability">Total Liabilities</option>
          </select>
        </div>
        <CurrencyButton />
      </div>
      <Graph
        xMax={xMax}
        xMin={xMin}
        dataset={dataset}
        historyData={resultList}
      />
    </div>
  );
}
