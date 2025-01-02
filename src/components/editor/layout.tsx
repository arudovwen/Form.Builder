import { DragEvent } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomBar from "./bottom-bar";
import MainPage from "./main";
import SideBar from "./sidebar";
import TopBar from "./topbar";
import { EditorProvider } from "../../context/editor-context";

export default function Layout() {
  const handleDragStart =
    (properties: any) => (event: DragEvent<HTMLDivElement>) => {
      event.dataTransfer.setData("properties", JSON.stringify(properties));
    };

  return (
    <EditorProvider>
      <div className="w-full h-screen bg-[#E4E7EC] flex flex-col">
        <ToastContainer />
        <div className="border-b  bg-white  border-[#E4E7EC]">
          <TopBar />
        </div>
        <div className="flex flex-1 ">
          <div className="w-[270px]  h-full border-l border-[#E4E7EC] bg-white">
            <SideBar handleDragStart={handleDragStart} />
          </div>
          <div className="flex-1 h-full max-h-full p-4 z-[1]">
            <MainPage />
          </div>
        </div>
        <div className="border-b  bg-white border-t border-[#E4E7EC]">
          <BottomBar />
        </div>
      </div>
    </EditorProvider>
  );
}
