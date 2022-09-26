import { SvgIcon, SvgIconProps } from "@mui/material";

function InquiryIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props}>
      <path
        d="M19,4H5C3.34,4,2,5.34,2,7v10c0,1.66,1.34,3,3,3h14c1.66,0,3-1.34,3-3V7C22,5.34,20.66,4,19,4z M5,6h14
	c0.55,0,1,0.45,1,1l-8,4.88L4,7C4,6.45,4.45,6,5,6z M20,17c0,0.55-0.45,1-1,1H5c-0.55,0-1-0.45-1-1V9.28l7.48,4.57
	c0.31,0.18,0.69,0.18,1,0L20,9.28V17z"
      />
    </SvgIcon>
  );
}

export default InquiryIcon;
