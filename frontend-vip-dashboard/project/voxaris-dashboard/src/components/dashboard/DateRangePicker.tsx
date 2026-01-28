import React from 'react';
import { Calendar } from 'lucide-react';
import { DateRange } from '../../types/dashboard.types';

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ value, onChange }) => {
    // Simplified Mock Picker for Demo 
    // In real app, use shadcn/ui Calendar or react-day-picker
  return (
    <button className="flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
      <Calendar className="w-4 h-4 text-gray-500" />
      <span>
        {value.start.toLocaleDateString()} - {value.end.toLocaleDateString()}
      </span>
    </button>
  );
};

export default DateRangePicker;
