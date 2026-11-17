import type { SVGProps } from "react";

type CheckBoxProps = SVGProps<SVGSVGElement> & { selected: boolean };

export function CheckBox({ selected,  ...props }: CheckBoxProps) {
  return (
    <svg viewBox="0 0 26 26" width={26} height={26} aria-hidden="true" focusable="false" {...props}>
      {selected ? (
        <>
          <circle cx="13" cy="13" r="12" fill="rgb(91, 71, 224)" />
          <path
            d="M8 13.5l3.2 3.2L18 9.8"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <circle cx="13" cy="13" r="11" fill="none" stroke="#C9C6DA" strokeWidth="2" />
      )}
    </svg>
  );
}
