export * from "./proxies";

export { UseBackButtonResult, useBackButton } from "./hooks/back-button";
export { UseKeyboardResult, useKeyboard } from "./hooks/keyboard";
export {
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
  onIonViewDidLeave,
} from "./hooks/lifecycle";
export { UseIonRouterResult, useIonRouter } from "./hooks/router";

export { IonicVue } from "./ionic-vue";

export { IonBackButton } from "./components/IonBackButton";
export { IonPage } from "./components/IonPage";
export { IonRouterOutlet } from "./components/IonRouterOutlet";
export { IonTabButton } from "./components/IonTabButton";
export { IonTabs } from "./components/IonTabs";
export { IonTabBar } from "./components/IonTabBar";
export { IonNav } from "./components/IonNav";
export { IonIcon } from "./components/IonIcon";
export { IonApp } from "./components/IonApp";

export * from "./components/Overlays";

export {
  modalController,
  popoverController,
  alertController,
  actionSheetController,
  loadingController,
  pickerController,
  toastController,
} from "./controllers";

export * from "./globalExtensions";

export {
  // UTILS
  createAnimation,
  createGesture,
  iosTransitionAnimation,
  mdTransitionAnimation,
  IonicSlides,
  getPlatforms,
  isPlatform,
  menuController,
  getTimeGivenProgression,
  getIonPageElement,
  openURL,

  // TYPES
  Animation,
  AnimationBuilder,
  AnimationCallbackOptions,
  AnimationDirection,
  AnimationFill,
  AnimationKeyFrames,
  AnimationLifecycle,
  Gesture,
  GestureConfig,
  GestureDetail,
  NavComponentWithProps,
  SpinnerTypes,
  AccordionGroupCustomEvent,
  AccordionGroupChangeEventDetail,
  BreadcrumbCustomEvent,
  BreadcrumbCollapsedClickEventDetail,
  ActionSheetOptions,
  ActionSheetButton,
  AlertOptions,
  AlertInput,
  AlertButton,
  BackButtonEvent,
  CheckboxCustomEvent,
  CheckboxChangeEventDetail,
  DatetimeCustomEvent,
  DatetimeChangeEventDetail,
  InfiniteScrollCustomEvent,
  InputCustomEvent,
  InputChangeEventDetail,
  InputOtpCustomEvent,
  InputOtpChangeEventDetail,
  InputOtpCompleteEventDetail,
  InputOtpInputEventDetail,
  // TODO(FW-6590): Remove the next two lines once the deprecated event is removed
  ItemReorderEventDetail,
  ItemReorderCustomEvent,
  ItemSlidingCustomEvent,
  IonicSafeString,
  LoadingOptions,
  MenuCustomEvent,
  ModalOptions,
  NavCustomEvent,
  PickerOptions,
  PickerButton,
  PickerColumn,
  PickerColumnOption,
  Platforms,
  PlatformConfig,
  PopoverOptions,
  RadioGroupCustomEvent,
  RadioGroupChangeEventDetail,
  RangeCustomEvent,
  RangeChangeEventDetail,
  RangeKnobMoveStartEventDetail,
  RangeKnobMoveEndEventDetail,
  RefresherCustomEvent,
  RefresherEventDetail,
  ReorderMoveCustomEvent,
  ReorderMoveEventDetail,
  ReorderEndCustomEvent,
  ReorderEndEventDetail,
  RouterEventDetail,
  RouterCustomEvent,
  ScrollBaseCustomEvent,
  ScrollBaseDetail,
  ScrollDetail,
  ScrollCustomEvent,
  SearchbarCustomEvent,
  SearchbarChangeEventDetail,
  SearchbarInputEventDetail,
  SegmentChangeEventDetail,
  SegmentCustomEvent,
  SegmentValue,
  SelectChangeEventDetail,
  SelectCustomEvent,
  TabsCustomEvent,
  TextareaChangeEventDetail,
  TextareaCustomEvent,
  ToastOptions,
  ToastButton,
  ToastLayout,
  ToggleChangeEventDetail,
  ToggleCustomEvent,
  TransitionOptions,
} from "@ionic/core/components";
