import Summary from '@/app/dashboard/Summary';
import Graph from '@/app/dashboard/Graph';
import CurrencyButton from '@/app/dashboard/CurrencyButton';

export default function DashBoard() {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <Summary />
      <CurrencyButton />
      <Graph />
    </div>
  );
}
