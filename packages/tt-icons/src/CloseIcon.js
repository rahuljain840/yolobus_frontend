import * as React from "react";

function SvgCloseIcon(props) {
  return (
    <svg width={20} height={18} {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-2-3h24v24H-2z" />
        <path
          d="M18.64.36L1.36 17.64m17.28 0L1.36.36"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

export default SvgCloseIcon;
