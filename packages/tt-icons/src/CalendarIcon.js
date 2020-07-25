import * as React from "react";

function SvgCalendarIcon(props) {
  return (
    <svg viewBox="0 0 25 25" {...props}>
      <rect
        className="CalendarIcon_svg__cls-calendar1"
        x={0.5}
        y={2.5}
        width={24}
        height={22}
        rx={1}
        ry={1}
        fill="none"
        stroke="#000"
        strokeMiterlimit={10}
      />
      <path
        className="CalendarIcon_svg__cls-calendar2"
        d="M1.5 2.5h22a1 1 0 011 1v4h0-24 0v-4a1 1 0 011-1z"
        stroke="#000"
        fill="#009688"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="CalendarIcon_svg__cls-calendar3"
        fill="none"
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.72 10.5v12m-6 0v-12m11.09 9H4.63m0-6h16.18m-.47-13l-.03 1.68M4.66.5l-.03 2"
      />
    </svg>
  );
}

export default SvgCalendarIcon;
