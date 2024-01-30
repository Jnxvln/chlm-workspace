import dayjs, { Dayjs } from "dayjs";
import TCalendarReveal from "@/Types.ts";

type TCalendarReveal = {
  date: string | number | Date | Dayjs | null | undefined;
};

export default function CalendarReveal({ date }: TCalendarReveal) {
  return (
    <div
      title={`${dayjs(date).format("MM/DD/YY hh:mm a")}`}
      className="text-center"
    >
      📅
    </div>
  );
}
