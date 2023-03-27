import React from "react";
import { Route, Routes } from "react-router-dom";

import App from "../App";
import NotFound from "./NotFound";
import DeepFakePage from "./pages/DeepFakePage";
import DownloadForwardPage from "./pages/DownloadForwardPage";
import ResultPage from "./pages/ResultPage";
import SelectArtPage from "./pages/SelectArtPage";
import SharePage from "./pages/SharePage";
import StartPage from "./pages/StartPage";
import WebcamCapturePage from "./pages/WebcamCapturePage";

// import { logEvent } from "firebase/analytics";
// import { analytics } from "../utils/firebase";

const SiteRoutes = () => {
  const endpoints = [
    "rijksmuseum",
    "stam",
    "nl",
    "be",
    // "vlaamsescriptieprijs",
    // "kmska",
    // "axelera"
  ];
  const renderApplicationRoutes = () => {
    return (
      <React.Fragment>
        <Route path="start" element={<StartPage />} />
        <Route path="capture" element={<WebcamCapturePage />} />
        <Route path="select" element={<SelectArtPage />} />
        <Route path="deepfake" element={<DeepFakePage />} />
        <Route path="result" element={<ResultPage />} />
        <Route path="result/share/:id" element={<SharePage />} />
      </React.Fragment>
    );
  };
  return (
    <Routes>
      {/* <Route
        path="youseum/leidsedam"
        element={<App youseumLocation={"leidsedam"} />}
      >
        <Route index element={<YouseumStartPage />} />
        {renderApplicationRoutes()}
      </Route>
      <Route
        path="youseum/stockholm"
        element={<App youseumLocation={"stockholm"} />}
      >
        <Route index element={<YouseumStartPage />} />
        {renderApplicationRoutes()}
      </Route> */}
      <Route path="result/download/:id" element={<DownloadForwardPage />} />

      {endpoints.map((endpoint) => (
        <React.Fragment key={endpoint}>
          <Route
            path={`${endpoint}/result/download/:id`}
            element={<DownloadForwardPage />}
          />
          <Route path={endpoint} element={<App />}>
            <Route index element={<StartPage />} />
            {renderApplicationRoutes()}
          </Route>

          <Route path="/" element={<App />}>
            <Route index element={<StartPage />} />
            {renderApplicationRoutes()}
          </Route>
        </React.Fragment>
      ))}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default SiteRoutes;
