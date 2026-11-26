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
import { PrequelUmbrellaIcon } from "./prequel-umbrella";
import { PrequelRainbowIcon } from "./prequel-rainbow";
import { PrequelLightningIcon } from "./prequel-lightning";
import { PrequelFogIcon } from "./prequel-fog";
import { PrequelSunriseIcon } from "./prequel-sunrise";
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
import { PrequelFilmIcon } from "./prequel-film";
import { PrequelImageIcon } from "./prequel-image";
import { PrequelRadioIcon } from "./prequel-radio";
import { PrequelPodcastIcon } from "./prequel-podcast";
import { PrequelSubtitlesIcon } from "./prequel-subtitles";
import { PrequelBellIcon } from "./prequel-bell";
import { PrequelMailIcon } from "./prequel-mail";
import { PrequelMessageIcon } from "./prequel-message";
import { PrequelSendIcon } from "./prequel-send";
import { PrequelMegaphoneIcon } from "./prequel-megaphone";
import { PrequelPhoneIcon } from "./prequel-phone";
import { PrequelVideoCallIcon } from "./prequel-video-call";
import { PrequelAtSignIcon } from "./prequel-at-sign";
import { PrequelChatBubblesIcon } from "./prequel-chat-bubbles";
import { PrequelReplyIcon } from "./prequel-reply";
import { PrequelRssIcon } from "./prequel-rss";
import { PrequelInboxIcon } from "./prequel-inbox";
import { PrequelVoicemailIcon } from "./prequel-voicemail";
import { PrequelCodeIcon } from "./prequel-code";
import { PrequelTerminalIcon } from "./prequel-terminal";
import { PrequelGitBranchIcon } from "./prequel-git-branch";
import { PrequelBugIcon } from "./prequel-bug";
import { PrequelDatabaseIcon } from "./prequel-database";
import { PrequelServerIcon } from "./prequel-server";
import { PrequelGitCommitIcon } from "./prequel-git-commit";
import { PrequelGitMergeIcon } from "./prequel-git-merge";
import { PrequelGitPullRequestIcon } from "./prequel-git-pull-request";
import { PrequelWebhookIcon } from "./prequel-webhook";
import { PrequelBracesIcon } from "./prequel-braces";
import { PrequelFileIcon } from "./prequel-file";
import { PrequelFolderIcon } from "./prequel-folder";
import { PrequelDownloadIcon } from "./prequel-download";
import { PrequelUploadIcon } from "./prequel-upload";
import { PrequelTrashIcon } from "./prequel-trash";
import { PrequelFileTextIcon } from "./prequel-file-text";
import { PrequelFilePlusIcon } from "./prequel-file-plus";
import { PrequelArchiveIcon } from "./prequel-archive";
import { PrequelFolderOpenIcon } from "./prequel-folder-open";
import { PrequelClipboardIcon } from "./prequel-clipboard";
import { PrequelUserIcon } from "./prequel-user";
import { PrequelUsersIcon } from "./prequel-users";
import { PrequelHeartIcon } from "./prequel-heart";
import { PrequelStarIcon } from "./prequel-star";
import { PrequelShoppingCartIcon } from "./prequel-cart";
import { PrequelShoppingBagIcon } from "./prequel-bag";
import { PrequelCreditCardIcon } from "./prequel-credit-card";
import { PrequelTagIcon } from "./prequel-tag";
import { PrequelStorefrontIcon } from "./prequel-storefront";
import { PrequelBarcodeIcon } from "./prequel-barcode";
import { PrequelGiftIcon } from "./prequel-gift";
import { PrequelDeliveryTruckIcon } from "./prequel-truck";
import { PrequelPackageIcon } from "./prequel-package";
import { PrequelCouponIcon } from "./prequel-coupon";
import { PrequelBasketIcon } from "./prequel-basket";
import { PrequelScaleIcon } from "./prequel-scale";
import { PrequelWalletIcon } from "./prequel-wallet";
import { PrequelCoinsIcon } from "./prequel-coins";
import { PrequelBankIcon } from "./prequel-bank";
import { PrequelReceiptIcon } from "./prequel-receipt";
import { PrequelPiggyBankIcon } from "./prequel-piggy-bank";
import { PrequelPercentIcon } from "./prequel-percent";
import { PrequelBanknoteIcon } from "./prequel-banknote";
import { PrequelSafeIcon } from "./prequel-safe";
import { PrequelInvoiceIcon } from "./prequel-invoice";
import { PrequelCurrencyExchangeIcon } from "./prequel-currency-exchange";
import { PrequelHeartPulseIcon } from "./prequel-heart-pulse";
import { PrequelStethoscopeIcon } from "./prequel-stethoscope";
import { PrequelPillIcon } from "./prequel-pill";
import { PrequelSyringeIcon } from "./prequel-syringe";
import { PrequelThermometerIcon } from "./prequel-thermometer";
import { PrequelFirstAidIcon } from "./prequel-first-aid";
import { PrequelLungsIcon } from "./prequel-lungs";
import { PrequelDnaIcon } from "./prequel-dna";
import { PrequelActivityIcon } from "./prequel-activity";
import { PrequelHospitalIcon } from "./prequel-hospital";
import { PrequelLeafIcon } from "./prequel-leaf";
import { PrequelFlameIcon } from "./prequel-flame";
import { PrequelDropletIcon } from "./prequel-droplet";
import { PrequelMountainIcon } from "./prequel-mountain";
import { PrequelPlaneIcon } from "./prequel-plane";
import { PrequelSuitcaseIcon } from "./prequel-suitcase";
import { PrequelMapPinIcon } from "./prequel-map-pin";
import { PrequelCompassIcon } from "./prequel-compass";
import { PrequelPassportIcon } from "./prequel-passport";
import { PrequelHotelIcon } from "./prequel-hotel";
import { PrequelTrainIcon } from "./prequel-train";
import { PrequelCarIcon } from "./prequel-car";
import { PrequelBikeIcon } from "./prequel-bike";
import { PrequelGlobeIcon } from "./prequel-globe";
import { PrequelSparklesIcon } from "./prequel-sparkles";
import { PrequelBotIcon } from "./prequel-bot";
import { PrequelBrainCircuitIcon } from "./prequel-brain-circuit";
import { PrequelChipIcon } from "./prequel-chip";
import { PrequelNeuralIcon } from "./prequel-neural";
import { PrequelWandIcon } from "./prequel-wand";
import { PrequelPromptIcon } from "./prequel-prompt";
import { PrequelRobotIcon } from "./prequel-robot";
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
  "umbrella": PrequelUmbrellaIcon,
  "rainbow": PrequelRainbowIcon,
  "lightning": PrequelLightningIcon,
  "fog": PrequelFogIcon,
  "sunrise": PrequelSunriseIcon,
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
  "film": PrequelFilmIcon,
  "image": PrequelImageIcon,
  "radio": PrequelRadioIcon,
  "podcast": PrequelPodcastIcon,
  "subtitles": PrequelSubtitlesIcon,
  "bell": PrequelBellIcon,
  "mail": PrequelMailIcon,
  "message": PrequelMessageIcon,
  "send": PrequelSendIcon,
  "megaphone": PrequelMegaphoneIcon,
  "phone": PrequelPhoneIcon,
  "video-call": PrequelVideoCallIcon,
  "at-sign": PrequelAtSignIcon,
  "chat-bubbles": PrequelChatBubblesIcon,
  "reply": PrequelReplyIcon,
  "rss": PrequelRssIcon,
  "inbox": PrequelInboxIcon,
  "voicemail": PrequelVoicemailIcon,
  "code": PrequelCodeIcon,
  "terminal": PrequelTerminalIcon,
  "git-branch": PrequelGitBranchIcon,
  "bug": PrequelBugIcon,
  "database": PrequelDatabaseIcon,
  "server": PrequelServerIcon,
  "git-commit": PrequelGitCommitIcon,
  "git-merge": PrequelGitMergeIcon,
  "git-pull-request": PrequelGitPullRequestIcon,
  "webhook": PrequelWebhookIcon,
  "braces": PrequelBracesIcon,
  "file": PrequelFileIcon,
  "folder": PrequelFolderIcon,
  "download": PrequelDownloadIcon,
  "upload": PrequelUploadIcon,
  "trash": PrequelTrashIcon,
  "file-text": PrequelFileTextIcon,
  "file-plus": PrequelFilePlusIcon,
  "archive": PrequelArchiveIcon,
  "folder-open": PrequelFolderOpenIcon,
  "clipboard": PrequelClipboardIcon,
  "user": PrequelUserIcon,
  "users": PrequelUsersIcon,
  "heart": PrequelHeartIcon,
  "star": PrequelStarIcon,
  "cart": PrequelShoppingCartIcon,
  "bag": PrequelShoppingBagIcon,
  "credit-card": PrequelCreditCardIcon,
  "tag": PrequelTagIcon,
  "storefront": PrequelStorefrontIcon,
  "barcode": PrequelBarcodeIcon,
  "gift": PrequelGiftIcon,
  "truck": PrequelDeliveryTruckIcon,
  "package": PrequelPackageIcon,
  "coupon": PrequelCouponIcon,
  "basket": PrequelBasketIcon,
  "scale": PrequelScaleIcon,
  "wallet": PrequelWalletIcon,
  "coins": PrequelCoinsIcon,
  "bank": PrequelBankIcon,
  "receipt": PrequelReceiptIcon,
  "piggy-bank": PrequelPiggyBankIcon,
  "percent": PrequelPercentIcon,
  "banknote": PrequelBanknoteIcon,
  "safe": PrequelSafeIcon,
  "invoice": PrequelInvoiceIcon,
  "currency-exchange": PrequelCurrencyExchangeIcon,
  "heart-pulse": PrequelHeartPulseIcon,
  "stethoscope": PrequelStethoscopeIcon,
  "pill": PrequelPillIcon,
  "syringe": PrequelSyringeIcon,
  "thermometer": PrequelThermometerIcon,
  "first-aid": PrequelFirstAidIcon,
  "lungs": PrequelLungsIcon,
  "dna": PrequelDnaIcon,
  "activity": PrequelActivityIcon,
  "hospital": PrequelHospitalIcon,
  "leaf": PrequelLeafIcon,
  "flame": PrequelFlameIcon,
  "droplet": PrequelDropletIcon,
  "mountain": PrequelMountainIcon,
  "plane": PrequelPlaneIcon,
  "suitcase": PrequelSuitcaseIcon,
  "map-pin": PrequelMapPinIcon,
  "compass": PrequelCompassIcon,
  "passport": PrequelPassportIcon,
  "hotel": PrequelHotelIcon,
  "train": PrequelTrainIcon,
  "car": PrequelCarIcon,
  "bike": PrequelBikeIcon,
  "globe": PrequelGlobeIcon,
  "sparkles": PrequelSparklesIcon,
  "bot": PrequelBotIcon,
  "brain-circuit": PrequelBrainCircuitIcon,
  "chip": PrequelChipIcon,
  "neural": PrequelNeuralIcon,
  "wand": PrequelWandIcon,
  "prompt": PrequelPromptIcon,
  "robot": PrequelRobotIcon,
  "search": PrequelSearchIcon,
  "settings": PrequelSettingsIcon,
  "lock": PrequelLockIcon,
};
