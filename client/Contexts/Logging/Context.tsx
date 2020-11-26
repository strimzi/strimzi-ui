/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { createContext, FunctionComponent } from 'react';
import { LoggingStateType } from './Logging.types';

const initialState: LoggingStateType = {
  websocket: null,
  messageBuffer: [],
};

const LoggingContext = createContext<React.MutableRefObject<
  LoggingStateType
> | null>(null);

const LoggingProvider: FunctionComponent = ({ children, ...others }) => {
  // Use a ref to store the state as it needs to be immutable
  const loggingRef = React.useRef<LoggingStateType>(initialState);

  return (
    <LoggingContext.Provider {...others} value={loggingRef}>
      {children}
    </LoggingContext.Provider>
  );
};

export { LoggingProvider, LoggingContext };
