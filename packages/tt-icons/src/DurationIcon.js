import * as React from "react";

function SvgDurationIcon(props) {
  return (
    <svg viewBox="0 0 22.38 23" {...props}>
      <rect
        className="DurationIcon_svg__cls-duration1"
        x={0.5}
        y={2.5}
        width={20}
        height={20}
        rx={10}
        ry={10}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#000"
      />
      <path
        className="DurationIcon_svg__cls-duration2"
        d="M10 5.59v7.53h7.53A7.53 7.53 0 0010 5.59z"
        fill="#009688"
      />
      <path
        className="DurationIcon_svg__cls-duration1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#000"
        d="M16.62.5H4.45"
      />
      <path
        className="DurationIcon_svg__cls-duration3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="#009688"
        d="M21.88 7.4l-1.72-3.03"
      />
    </svg>
  );
}

export default SvgDurationIcon;
