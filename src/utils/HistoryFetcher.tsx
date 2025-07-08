import { useEffect, useRef } from 'react';
import { useClient } from 'urql';
import { Session } from 'next-auth';

interface DataType {
  date: Date;
  networth: number;
  asset: number;
  liability: number;
}

interface HistoryFetcherProps {
  session: Session | null;
  now: Date;
  resultList: DataType[];
  setResultList: React.Dispatch<React.SetStateAction<DataType[]>>;
}

export default function HistoryFetcher({
  session,
  now,
  setResultList,
}: HistoryFetcherProps) {
  const client = useClient();
  const hasFetchedRef = useRef(false);

  const GET_Current_Asset_Values = `
  query GetCurrentValues($email: String!) {
     user(email: $email){
      asset {
        value
        }
    }
  }
`;

  // GraphQL query
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

  // GraphQL query
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

  useEffect(() => {
    if (!session?.user?.email) return;
    if (hasFetchedRef.current) return; // prevent double-run
    hasFetchedRef.current = true;

    const fetchData = async () => {
      let monthOffset = 0;

      const currentAssetValues = await client
        .query(GET_Current_Asset_Values, {
          email: session.user?.email,
        })
        .toPromise();

      // Handle query errors
      if (currentAssetValues.error) {
        console.error('Error fetching data:', currentAssetValues.error);
        return;
      }

      const currentAssetValue = currentAssetValues.data.user.asset.reduce(
        (acc: number, account: { value: string }) =>
          acc + Number(account.value),
        0,
      );

      const currentLiabilityValues = await client
        .query(GET_Current_Liability_Values, {
          email: session.user?.email,
        })
        .toPromise();

      // Handle query errors
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

      setResultList((prev) => [
        ...prev,
        {
          date: now,
          networth: currentAssetValue + currentLiabilityValue,
          asset: currentAssetValue,
          liability: currentLiabilityValue,
        },
      ]);

      // Continue fetching until the condition is met
      while (true) {
        const date = new Date(now);
        date.setDate(1);
        date.setMonth(date.getMonth() - monthOffset);
        try {
          // Manually run the query
          const assetResult = await client
            .query(GET_Asset_HISTORY, {
              email: session.user?.email,
              after: date,
            })
            .toPromise(); // Convert to promise to use async/await

          // Handle query errors
          if (assetResult.error) {
            console.error('Error fetching data:', assetResult.error);
            break;
          }

          const liabilityResult = await client
            .query(GET_Liability_HISTORY, {
              email: session.user?.email,
              after: date,
            })
            .toPromise(); // Convert to promise to use async/await

          // Handle query errors
          if (liabilityResult.error) {
            console.error('Error fetching data:', liabilityResult.error);
            break;
          }

          const assets = assetResult.data?.user?.asset;
          const liabilities = liabilityResult.data?.user?.liability;

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
          const data = {
            date: date,
            networth: assetTotal + liabilityTotal,
            asset: assetTotal,
            liability: liabilityTotal,
          };
          if (assetIsFinished && liabilityIsFinished) break;
          // Update state with new data
          setResultList((prev) => [...prev, data]);
          monthOffset += 1;
          console.log(data);
        } catch (err) {
          console.error('Fetch error:', err);
          break;
        }
      }
    };

    fetchData(); // Call the fetch function
  }, [session]); // Re-run when session or totalValue changes
}
