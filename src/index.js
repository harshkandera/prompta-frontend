import React,{useEffect} from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import * as Sentry from "@sentry/react";
import { BrowserRouter , createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,} from "react-router-dom";
import persistedReducer from "./reducer/index.js";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
export const store = configureStore({
  reducer: persistedReducer,
});

Sentry.init({
  dsn: "https://7fe7be3d4337cb79a71a8c24dcf49342@o4508236019990528.ingest.us.sentry.io/4508437807235072",
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,  
    }),
    Sentry.replayIntegration(),
  ], // Tracing settings
  tracesSampleRate: 1.0, // Capture 100% of transactions
  tracePropagationTargets: [/^\//, /^https:\/\/prompta\.in\/api/],
  replaysSessionSampleRate: 0.1, // Set to 10% in production
  replaysOnErrorSampleRate: 1.0, // Sample 100% of sessions on error
});


function disableConsoleLogs() {
  if (process.env.NODE_ENV === "production") {
    console.log = () => {};
    console.debug = () => {};
  }
}
disableConsoleLogs();


const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
        <BrowserRouter>
          <App className="bg-[#F5F7FA]" />
          <Toaster />
        </BrowserRouter>
      </Sentry.ErrorBoundary>
    </PersistGate>
  </Provider>
);

reportWebVitals();
