import * as dates from "react-big-calendar/lib/utils/dates";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { Loading, Ripple } from "../ui";

import { fetcher } from "../lib";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { useAppState } from "./AppProvider";
import useSWR from "swr";
import { useTranslation } from "i18n";

const CalendarApp = () => {
  const { t } = useTranslation("calendar");
  const [state] = useAppState();
  const { data, error } = useSWR(`/api/calendar`, fetcher);
  const locales = {
    en: require("date-fns/locale/en-US"),
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const CustomToolbar = (toolbar) => {
    const goToDayView = () => toolbar.onView("day");

    const goToWeekView = () => toolbar.onView("week");

    const goToMonthView = () => toolbar.onView("month");

    const goToBack = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() - 1);
      toolbar.onNavigate("prev");
    };

    const goToNext = () => {
      toolbar.date.setMonth(toolbar.date.getMonth() + 1);
      toolbar.onNavigate("next");
    };

    const goToCurrent = () => {
      const now = new Date();
      toolbar.date.setMonth(now.getMonth());
      toolbar.date.setYear(now.getFullYear());
      toolbar.onNavigate("current");
    };

    const label = () => {
      const date = new Date(toolbar.date);
      return (
        <span className="text-base">{format(date, "MMMM")} <span> {format(date, "yyyy")}</span></span>
      );
    };

    return (
      <div className="flex flex-wrap justify-center sm:justify-between items-center px-5 py-2">
        <div className="w-full sm:w-auto text-center sm:ltr:text-left sm:rtl:text-righ py-1">
          <h3 className="mb-0">{label()}</h3>
        </div>
        <div className="inline-flex px-2 py-1">
          <button
            className="relative inline-flex justify-center ltr:rounded-l-lg rtl:rounded-r-lg border border-transparent px-4 py-3 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none"
            onClick={goToDayView}
          >
            {t("day")}
            <Ripple color="black" />
          </button>
          <button
            className="relative inline-flex justify-center border-t border-b border-transparent px-4 py-3 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none"
            onClick={goToWeekView}
          >
            {t("week")}
            <Ripple color="black" />
          </button>
          <button
            className="relative inline-flex justify-center ltr:rounded-r-lg rtl:rounded-l-lg border border-transparent px-4 py-3 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none"
            onClick={goToMonthView}
          >
            {t("month")}
            <Ripple color="black" />
          </button>
        </div>

        <div className="inline-flex px-2 py-1">
          <button
            className="relative inline-flex justify-center ltr:rounded-l-lg rtl:rounded-r-lg border border-transparent px-4 py-3 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none"
            onClick={goToBack}
          >
            {t("back")}
            <Ripple color="black" />
          </button>
          <button
            className="relative inline-flex justify-center border-t border-b border-transparent px-4 py-3 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none"
            onClick={goToCurrent}
          >
            {t("today")}
            <Ripple color="black" />
          </button>
          <button
            className="relative inline-flex justify-center ltr:rounded-r-lg rtl:rounded-l-lg border border-transparent px-4 py-3 bg-white text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline transition ease-in-out duration-150 text-sm leading-none"
            onClick={goToNext}
          >
            {t("next")}
            <Ripple color="black" />
          </button>
        </div>
      </div>
    );
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-full">
        Failed to load calendar data
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center h-full">
        <Loading />
      </div>
    );

  return (
    <div className="-mx-4 overflow-y-auto h-full block">
      <Calendar
        rtl={state.rtl}
        localizer={localizer}
        events={data}
        step={60}
        showMultiDayTimes
        max={dates.add(dates.endOf(new Date(2015, 17, 1), "day"), -1, "hours")}
        defaultDate={new Date(2015, 3, 1)}
        components={{
          toolbar: CustomToolbar,
        }}
      />
    </div>
  );
};

export default CalendarApp;
