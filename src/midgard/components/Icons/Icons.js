import React from "react";
import { makeStyles } from "@material-ui/core/styles";
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
    <SvgIcon
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
    </SvgIcon>
  );
}

export function ShockIcon(props) {
  return (
    <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24">
      <path
      d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"
    />
    </SvgIcon>
  );
}

export function TiltIcon(props) {
  return (
    <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24">
      <path
      d="M 23.726562 22.398438 L 1.601562 0.273438 C 1.234375 -0.0898438 0.640625 -0.0898438 0.273438 0.273438 C -0.0898438 0.640625 -0.0898438 1.234375 0.273438 1.601562 L 4.078125 5.402344 L 0.269531 13.394531 L 0.265625 13.402344 C -0.230469 14.457031 -0.0117188 15.730469 0.804688 16.5625 L 7.257812 23.15625 C 7.796875 23.707031 8.53125 24 9.273438 24 C 9.660156 24 10.050781 23.917969 10.421875 23.753906 L 18.75 20.078125 L 22.398438 23.726562 C 22.582031 23.910156 22.824219 24 23.0625 24 C 23.300781 24 23.542969 23.910156 23.726562 23.726562 C 24.089844 23.359375 24.089844 22.765625 23.726562 22.398438 Z M 9.007812 10.332031 L 2.371094 13.335938 L 5.484375 6.808594 Z M 9.660156 22.039062 L 9.652344 22.042969 C 9.296875 22.203125 8.871094 22.125 8.597656 21.84375 L 2.3125 15.421875 L 10.421875 11.75 L 17.328125 18.65625 Z M 7.585938 4.003906 C 7.367188 3.535156 7.574219 2.976562 8.042969 2.757812 L 13.402344 0.265625 C 14.457031 -0.230469 15.730469 -0.0117188 16.5625 0.804688 L 23.15625 7.257812 C 23.996094 8.082031 24.234375 9.351562 23.75 10.421875 L 21.292969 15.945312 C 21.136719 16.292969 20.796875 16.5 20.4375 16.5 C 20.308594 16.5 20.179688 16.472656 20.054688 16.417969 C 19.582031 16.207031 19.371094 15.652344 19.582031 15.179688 L 22.042969 9.652344 C 22.203125 9.296875 22.125 8.871094 21.84375 8.597656 L 15.421875 2.3125 L 13.089844 7.464844 C 12.929688 7.8125 12.589844 8.015625 12.234375 8.015625 C 12.105469 8.015625 11.972656 7.988281 11.847656 7.933594 C 11.375 7.71875 11.167969 7.164062 11.378906 6.691406 L 13.34375 2.359375 L 8.832031 4.460938 C 8.363281 4.679688 7.804688 4.472656 7.585938 4.003906 Z M 7.585938 4.003906 "
      />
    </SvgIcon>
  );
}

export function LightIcon(props) {
  return (
    <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    style={{ color: props.color }}
    height="24"
    viewBox="0 0 24 24"
    width="24">
      <rect fill="none" height="24" width="24"/>
      <path
      fill={props.color}
      d="M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0 c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2 c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1 C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06 c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41 l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41 c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36 c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"
      />
    </SvgIcon>
  );
}

export function BatteryIcon(props) {
  return (
    <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path
      fill={props.color}
      d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"
    />
    </SvgIcon>
    );
}

export function PressureIcon(props) {
  return (
    <SvgIcon
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24">
      <path d="M 12.007812 2.546875 C 5.386719 2.546875 0 7.621094 0 13.855469 C 0 16.527344 1.007812 19.117188 2.835938 21.15625 C 3.015625 21.355469 3.273438 21.472656 3.542969 21.472656 L 20.472656 21.472656 C 20.746094 21.472656 21.003906 21.355469 21.183594 21.15625 C 23.011719 19.117188 24.019531 16.527344 24.019531 13.855469 C 24.019531 7.621094 18.632812 2.546875 12.007812 2.546875 Z M 18.910156 16.0625 C 18.816406 16.015625 18.710938 15.988281 18.601562 15.988281 C 18.339844 15.988281 18.101562 16.136719 17.980469 16.375 C 17.898438 16.539062 17.886719 16.730469 17.945312 16.90625 C 18.003906 17.082031 18.128906 17.222656 18.292969 17.304688 L 20.769531 18.539062 C 20.574219 18.851562 20.363281 19.15625 20.132812 19.445312 L 20.039062 19.566406 L 3.980469 19.566406 L 3.886719 19.445312 C 3.632812 19.125 3.445312 18.855469 3.25 18.539062 L 5.726562 17.304688 C 5.890625 17.222656 6.015625 17.082031 6.074219 16.90625 C 6.132812 16.730469 6.121094 16.539062 6.039062 16.375 C 5.917969 16.136719 5.679688 15.988281 5.414062 15.988281 C 5.308594 15.988281 5.203125 16.015625 5.105469 16.0625 L 2.613281 17.304688 C 2.152344 16.210938 1.90625 15.035156 1.90625 13.855469 C 1.90625 13.421875 1.9375 12.996094 2 12.578125 L 4.40625 12.945312 C 4.441406 12.949219 4.476562 12.953125 4.511719 12.953125 C 4.851562 12.953125 5.148438 12.699219 5.199219 12.363281 C 5.253906 11.984375 4.996094 11.628906 4.617188 11.574219 L 2.3125 11.222656 C 2.804688 9.652344 3.726562 8.25 4.949219 7.136719 L 6.617188 8.851562 C 6.75 8.984375 6.925781 9.0625 7.117188 9.0625 C 7.296875 9.0625 7.46875 8.992188 7.597656 8.863281 C 7.734375 8.734375 7.808594 8.5625 7.808594 8.375 C 7.8125 8.191406 7.742188 8.015625 7.613281 7.882812 L 6.046875 6.273438 C 7.542969 5.25 9.351562 4.601562 11.316406 4.476562 L 11.316406 6.828125 C 11.316406 7.210938 11.625 7.523438 12.007812 7.523438 C 12.390625 7.523438 12.703125 7.210938 12.703125 6.828125 L 12.703125 4.476562 C 14.664062 4.601562 16.476562 5.25 17.972656 6.273438 L 16.40625 7.882812 C 16.277344 8.015625 16.207031 8.191406 16.210938 8.375 C 16.210938 8.5625 16.285156 8.734375 16.417969 8.863281 C 16.550781 8.992188 16.722656 9.0625 16.902344 9.0625 C 17.09375 9.0625 17.269531 8.988281 17.402344 8.851562 L 19.066406 7.136719 C 20.292969 8.25 21.214844 9.652344 21.707031 11.222656 L 19.402344 11.574219 C 19.023438 11.628906 18.761719 11.984375 18.820312 12.363281 C 18.871094 12.699219 19.167969 12.953125 19.503906 12.953125 C 19.539062 12.953125 19.578125 12.949219 19.609375 12.945312 L 22.019531 12.578125 C 22.078125 12.996094 22.113281 13.421875 22.113281 13.855469 C 22.113281 15.035156 21.867188 16.210938 21.402344 17.304688 Z M 18.910156 16.0625 "
      />
      <path d="M 12.40625 13.554688 L 10.226562 8.71875 C 10.179688 8.613281 10.0625 8.554688 9.945312 8.582031 C 9.8125 8.613281 9.734375 8.746094 9.765625 8.878906 L 11.007812 14.03125 C 10.699219 14.398438 10.589844 14.914062 10.753906 15.398438 C 11.007812 16.140625 11.816406 16.535156 12.558594 16.28125 C 13.300781 16.027344 13.695312 15.222656 13.441406 14.480469 C 13.277344 13.992188 12.871094 13.65625 12.40625 13.554688 Z M 12.40625 13.554688 "
      />
    </SvgIcon>
    );
}