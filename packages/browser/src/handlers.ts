export type WindowEvent = "unhandledrejection" | "onerror";

type EventCallback<T> = (data: T) => void;

export type EventOnUnhandledRejectionType = {
  window: WindowEventHandlers;
  event: PromiseRejectionEvent;
};

export type EventOnErrorType = {
  event: Event | string;
  source?: string;
  lineno?: number;
  colno?: number;
  error?: Error;
};

const handleUnhandledrejection = (callback: EventCallback<EventOnUnhandledRejectionType>) => {
  window.onunhandledrejection = function (this: WindowEventHandlers, ev: PromiseRejectionEvent) {
    callback({
      event: ev,
      window: this
    });
  };
};

const handleOnError = (callback: EventCallback<EventOnErrorType>) => {
  window.onerror = function (
    event: Event | string,
    source?: string,
    lineno?: number,
    colno?: number,
    error?: Error
  ) {
    callback({
      event,
      source,
      lineno,
      colno,
      error
    });
  };
};

export const windowEventHandlers: Record<WindowEvent, Function> = {
  onerror: handleOnError,
  unhandledrejection: handleUnhandledrejection
};
