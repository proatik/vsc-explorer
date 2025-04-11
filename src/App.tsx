import { MainContextProvider } from "./contexts/MainContext";

import Sidebar from "./components/Sidebar";
import Explorer from "./components/Explorer";

function App() {
  return (
    <div className="w-screen h-screen p-4 sm:p-8 md:p-12">
      <div className="flex flex-row w-full h-full border-2 rounded-md border-slate-600 bg-[#0b0c25]">
        <MainContextProvider>
          <Sidebar />
          <Explorer />
        </MainContextProvider>
      </div>
    </div>
  );
}

export default App;
