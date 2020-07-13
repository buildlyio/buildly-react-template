import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import SvgIcon from "@material-ui/core/SvgIcon";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > svg": {
      margin: theme.spacing(2),
    },
  },
}));

export function HumidIcon(props) {
  return (
    <SvgIcon style={{ color: props.color }}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 3.1L7.05 8.05a7 7 0 1 0 9.9 0L12 3.1zm0-2.828l6.364 6.364a9 9 0 1 1-12.728 0L12 .272zM12 18V8a5 5 0 0 1 0 10z" />
    </SvgIcon>
  );
}

export function TempIcon(props) {
  return (
    <SvgIcon style={{ color: props.color }}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M8 5a4 4 0 1 1 8 0v5.255a7 7 0 1 1-8 0V5zm1.144 6.895a5 5 0 1 0 5.712 0L14 11.298V5a2 2 0 1 0-4 0v6.298l-.856.597zm1.856.231V5h2v7.126A4.002 4.002 0 0 1 12 20a4 4 0 0 1-1-7.874zM12 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    </SvgIcon>
  );
}

export function DelayIcon(props) {
  return (
    <SvgIcon style={{ color: props.color }}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2zm0 18c4.42 0 8-3.58 8-8s-3.58-8-8-8-8 3.58-8 8 3.58 8 8 8zm3.536-12.95l1.414 1.414-4.95 4.95L10.586 12l4.95-4.95z" />
    </SvgIcon>
  );
}

export function RecallIcon(props) {
  return (
    <svg
      style={{ color: props.color }}
      width="24"
      height="24"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.6651 6.73244C13.0416 6.4071 12.3718 6.25121 11.7085 6.25121C12.0733 5.60732 12.2855 4.85498 12.2855 4.06198C12.2855 2.25908 11.2177 0.706955 9.69228 0.0359513C9.42035 -0.0860494 9.10862 0.117285 9.10862 0.422287C9.10862 0.578177 9.19484 0.727289 9.33412 0.801845C10.3422 1.31696 11.0188 2.39463 10.979 3.63497C10.9657 4.12298 10.833 4.57709 10.6142 4.98376C9.88461 4.40087 8.96934 4.0552 7.97448 4.0552C6.99288 4.0552 6.09088 4.39409 5.36794 4.96342C5.14244 4.53642 5.01643 4.04842 5.01643 3.53331C5.01643 2.34041 5.6863 1.31018 6.66126 0.808622C6.80054 0.734066 6.88677 0.591732 6.88677 0.429065C6.88677 0.124063 6.58168 -0.0792716 6.30975 0.0359513C4.7246 0.734067 3.63025 2.38108 3.71648 4.27887C3.74964 4.98376 3.94861 5.64121 4.2736 6.2241C4.26697 6.23088 4.26033 6.24443 4.26033 6.25121C3.54403 6.25799 2.81447 6.44777 2.15123 6.84088C0.61251 7.73555 -0.163482 9.45712 0.028858 11.1448C0.0620201 11.4498 0.39364 11.6192 0.652304 11.4634C0.784952 11.382 0.871174 11.2329 0.857909 11.077C0.791585 9.93157 1.3686 8.78611 2.43642 8.20322C2.84763 7.97955 3.28537 7.87111 3.72311 7.85078C3.69658 8.04055 3.68331 8.23711 3.68331 8.43367C3.68331 10.2705 4.79756 11.8497 6.36944 12.5004C6.11741 12.9138 5.76589 13.2663 5.32815 13.5306C4.32002 14.127 3.11293 14.0457 2.19765 13.4357C2.06501 13.3476 1.8992 13.3476 1.76655 13.4221C1.50788 13.5713 1.48799 13.944 1.72675 14.127C3.11293 15.1844 5.04959 15.3267 6.61484 14.3033C7.19849 13.9169 7.66276 13.4086 7.99438 12.8189C8.00101 12.8189 8.00101 12.8189 8.00764 12.8189C8.37243 13.4628 8.89639 14.0186 9.57289 14.4117C11.105 15.3132 12.9488 15.1437 14.2819 14.127C14.5207 13.944 14.5008 13.5713 14.2421 13.4154C14.1095 13.334 13.9436 13.3408 13.811 13.4289C12.8692 14.0593 11.6157 14.127 10.5876 13.4696C10.1897 13.212 9.86472 12.8731 9.63258 12.48C11.1846 11.8158 12.2789 10.2501 12.2789 8.43367C12.2789 8.23033 12.2656 8.03378 12.2391 7.844C12.7233 7.85755 13.2141 7.98633 13.6651 8.25067C14.6732 8.84711 15.2104 9.9519 15.1507 11.0702C15.1441 11.2261 15.2237 11.382 15.3563 11.4566C15.615 11.6057 15.94 11.443 15.9732 11.138C16.1655 9.39612 15.3166 7.6 13.6651 6.73244ZM9.83819 5.91232C9.33412 6.32577 8.69078 6.56977 8.00764 6.56977C7.29798 6.56977 6.64137 6.31899 6.12404 5.89199C6.64137 5.49887 7.27808 5.26843 7.96785 5.26843C8.67088 5.2752 9.32086 5.51243 9.83819 5.91232ZM4.87715 8.44044C4.87715 8.31167 4.88378 8.18289 4.90368 8.05411C5.52049 8.29133 6.06435 8.73867 6.41586 9.36223C6.77401 9.99257 6.88677 10.6975 6.78728 11.3617C5.65977 10.8805 4.87715 9.75534 4.87715 8.44044ZM9.21474 11.3414C9.12189 10.6839 9.22801 9.99934 9.57289 9.38256C9.91778 8.759 10.4484 8.31844 11.0519 8.06767C11.0652 8.18967 11.0718 8.31167 11.0718 8.44044C11.0718 9.73501 10.3091 10.8466 9.21474 11.3414Z"
        fill={props.color}
      />
    </svg>
  );
}
