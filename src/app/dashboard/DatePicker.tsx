import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';

type DatePickType = {
  setXMax: React.Dispatch<React.SetStateAction<Date>>;
  setXMin: React.Dispatch<React.SetStateAction<Date>>;
  xMax: Date;
  xMin: Date;
};

export const DatePick = (props: DatePickType) => {
  return (
    <div className="flex flex-row items-center gap-1 border-2 border-gray-200 rounded-md p-2">
      <CalendarDaysIcon className="w-[20px]" />
      <DatePicker
        selected={props.xMin}
        onChange={(date) => {
          if (date) props.setXMin(date);
        }}
        selectsStart
        startDate={props.xMin}
        endDate={props.xMax}
        className="w-[85px]"
      />
      —
      <DatePicker
        selected={props.xMax}
        onChange={(date) => {
          if (date) props.setXMax(date);
        }}
        selectsEnd
        startDate={props.xMin}
        endDate={props.xMax}
        minDate={props.xMin}
        className="w-[85px]"
      />
    </div>
  );
};
