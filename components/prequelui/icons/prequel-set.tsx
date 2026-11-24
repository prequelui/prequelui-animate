"use client";

import type { ComponentType } from "react";
import type { SVGMotionProps } from "motion/react";
import { PrequelArrowUpIcon } from "./prequel-arrow-up";
import { PrequelArrowDownIcon } from "./prequel-arrow-down";
import { PrequelArrowLeftIcon } from "./prequel-arrow-left";
import { PrequelArrowRightIcon } from "./prequel-arrow-right";
import { PrequelArrowUpRightIcon } from "./prequel-arrow-up-right";
import { PrequelArrowDownLeftIcon } from "./prequel-arrow-down-left";
import { PrequelRefreshIcon } from "./prequel-refresh";
import { PrequelRepeatIcon } from "./prequel-repeat";
import { PrequelChartBarIcon } from "./prequel-chart-bar";
import { PrequelChartLineIcon } from "./prequel-chart-line";
import { PrequelChartPieIcon } from "./prequel-chart-pie";
import { PrequelTrendingUpIcon } from "./prequel-trending-up";
import { PrequelTrendingDownIcon } from "./prequel-trending-down";
import { PrequelSunIcon } from "./prequel-sun";
import { PrequelMoonIcon } from "./prequel-moon";
import { PrequelCloudIcon } from "./prequel-cloud";
import { PrequelCloudRainIcon } from "./prequel-cloud-rain";
import { PrequelSnowflakeIcon } from "./prequel-snowflake";
import { PrequelWindIcon } from "./prequel-wind";
import { PrequelClockIcon } from "./prequel-clock";
import { PrequelAlarmClockIcon } from "./prequel-alarm-clock";
import { PrequelTimerIcon } from "./prequel-timer";
import { PrequelHourglassIcon } from "./prequel-hourglass";
import { PrequelCalendarIcon } from "./prequel-calendar";
import { PrequelSmartphoneIcon } from "./prequel-smartphone";
import { PrequelLaptopIcon } from "./prequel-laptop";
import { PrequelCameraIcon } from "./prequel-camera";
import { PrequelHeadphonesIcon } from "./prequel-headphones";
import { PrequelWatchIcon } from "./prequel-watch";
import { PrequelWifiIcon } from "./prequel-wifi";
import { PrequelBluetoothIcon } from "./prequel-bluetooth";
import { PrequelBatteryIcon } from "./prequel-battery";
import { PrequelSignalIcon } from "./prequel-signal";
import { PrequelLinkIcon } from "./prequel-link";
import { PrequelPlayIcon } from "./prequel-play";
import { PrequelPauseIcon } from "./prequel-pause";
import { PrequelVolumeIcon } from "./prequel-volume";
import { PrequelMicrophoneIcon } from "./prequel-mic";
import { PrequelMusicIcon } from "./prequel-music";
import { PrequelBellIcon } from "./prequel-bell";
import { PrequelMailIcon } from "./prequel-mail";
import { PrequelMessageIcon } from "./prequel-message";
import { PrequelSendIcon } from "./prequel-send";
import { PrequelMegaphoneIcon } from "./prequel-megaphone";
import { PrequelCodeIcon } from "./prequel-code";
import { PrequelTerminalIcon } from "./prequel-terminal";
import { PrequelGitBranchIcon } from "./prequel-git-branch";
import { PrequelBugIcon } from "./prequel-bug";
import { PrequelDatabaseIcon } from "./prequel-database";
import { PrequelServerIcon } from "./prequel-server";
import { PrequelFileIcon } from "./prequel-file";
import { PrequelFolderIcon } from "./prequel-folder";
import { PrequelDownloadIcon } from "./prequel-download";
import { PrequelUploadIcon } from "./prequel-upload";
import { PrequelTrashIcon } from "./prequel-trash";
import { PrequelUserIcon } from "./prequel-user";
import { PrequelUsersIcon } from "./prequel-users";
import { PrequelHeartIcon } from "./prequel-heart";
import { PrequelStarIcon } from "./prequel-star";
import { PrequelShoppingCartIcon } from "./prequel-cart";
import { PrequelShoppingBagIcon } from "./prequel-bag";
import { PrequelCreditCardIcon } from "./prequel-credit-card";
import { PrequelTagIcon } from "./prequel-tag";
import { PrequelLeafIcon } from "./prequel-leaf";
import { PrequelFlameIcon } from "./prequel-flame";
import { PrequelDropletIcon } from "./prequel-droplet";
import { PrequelMountainIcon } from "./prequel-mountain";
import { PrequelSearchIcon } from "./prequel-search";
import { PrequelSettingsIcon } from "./prequel-settings";
import { PrequelLockIcon } from "./prequel-lock";

export type PrequelIconComponent = ComponentType<
  Omit<SVGMotionProps<SVGSVGElement>, "ref"> & { size?: number }
>;

export const prequelIconComponents: Record<string, PrequelIconComponent> = {
  "arrow-up": PrequelArrowUpIcon,
  "arrow-down": PrequelArrowDownIcon,
  "arrow-left": PrequelArrowLeftIcon,
  "arrow-right": PrequelArrowRightIcon,
  "arrow-up-right": PrequelArrowUpRightIcon,
  "arrow-down-left": PrequelArrowDownLeftIcon,
  "refresh": PrequelRefreshIcon,
  "repeat": PrequelRepeatIcon,
  "chart-bar": PrequelChartBarIcon,
  "chart-line": PrequelChartLineIcon,
  "chart-pie": PrequelChartPieIcon,
  "trending-up": PrequelTrendingUpIcon,
  "trending-down": PrequelTrendingDownIcon,
  "sun": PrequelSunIcon,
  "moon": PrequelMoonIcon,
  "cloud": PrequelCloudIcon,
  "cloud-rain": PrequelCloudRainIcon,
  "snowflake": PrequelSnowflakeIcon,
  "wind": PrequelWindIcon,
  "clock": PrequelClockIcon,
  "alarm-clock": PrequelAlarmClockIcon,
  "timer": PrequelTimerIcon,
  "hourglass": PrequelHourglassIcon,
  "calendar": PrequelCalendarIcon,
  "smartphone": PrequelSmartphoneIcon,
  "laptop": PrequelLaptopIcon,
  "camera": PrequelCameraIcon,
  "headphones": PrequelHeadphonesIcon,
  "watch": PrequelWatchIcon,
  "wifi": PrequelWifiIcon,
  "bluetooth": PrequelBluetoothIcon,
  "battery": PrequelBatteryIcon,
  "signal": PrequelSignalIcon,
  "link": PrequelLinkIcon,
  "play": PrequelPlayIcon,
  "pause": PrequelPauseIcon,
  "volume": PrequelVolumeIcon,
  "mic": PrequelMicrophoneIcon,
  "music": PrequelMusicIcon,
  "bell": PrequelBellIcon,
  "mail": PrequelMailIcon,
  "message": PrequelMessageIcon,
  "send": PrequelSendIcon,
  "megaphone": PrequelMegaphoneIcon,
  "code": PrequelCodeIcon,
  "terminal": PrequelTerminalIcon,
  "git-branch": PrequelGitBranchIcon,
  "bug": PrequelBugIcon,
  "database": PrequelDatabaseIcon,
  "server": PrequelServerIcon,
  "file": PrequelFileIcon,
  "folder": PrequelFolderIcon,
  "download": PrequelDownloadIcon,
  "upload": PrequelUploadIcon,
  "trash": PrequelTrashIcon,
  "user": PrequelUserIcon,
  "users": PrequelUsersIcon,
  "heart": PrequelHeartIcon,
  "star": PrequelStarIcon,
  "cart": PrequelShoppingCartIcon,
  "bag": PrequelShoppingBagIcon,
  "credit-card": PrequelCreditCardIcon,
  "tag": PrequelTagIcon,
  "leaf": PrequelLeafIcon,
  "flame": PrequelFlameIcon,
  "droplet": PrequelDropletIcon,
  "mountain": PrequelMountainIcon,
  "search": PrequelSearchIcon,
  "settings": PrequelSettingsIcon,
  "lock": PrequelLockIcon,
};
