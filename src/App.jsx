import React, { useState } from "react";
import Home from "./Home";
import Meeting from "./Meeting";
import Report from "./Report";
import { HOME, MEETING, REPORT } from "./constants";

function App() {
  const [currentPage, setCurrentPage] = useState(HOME);

  const handlePageChange = nextPage => {
    setCurrentPage(nextPage);
  };

  const pages = {
    [HOME]: <Home goToNextPage={handlePageChange} />,
    [MEETING]: <Meeting goToNextPage={handlePageChange} />,
    [REPORT]: <Report goToNextPage={handlePageChange} />
  };

  return pages[currentPage];
}

export default App;
