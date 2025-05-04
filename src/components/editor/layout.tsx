import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BottomBar from "./bottom-bar";
import MainPage from "./main";
import SideBar from "./sidebar";
import TopBar from "./topbar";
import { EditorProvider } from "../../context/editor-context";

export interface BuilderProps {
  onSubmit: (e: any) => void; // Function to handle form submission
  questionData?: any; // Data for the questions in the form
  isReadOnly?: boolean; // Flag to indicate if the form is read-only
  config?: any; // Configuration for the form
  title?: string;
}

export default function Layout({
  onSubmit,
  questionData,
  title,
}: BuilderProps) {
  return (
    <EditorProvider>
      <div className="w-full h-screen bg-[#E4E7EC] flex flex-col">
        <ToastContainer />
        <div className="border-b  bg-white  border-[#E4E7EC]">
          <TopBar title={title} />
        </div>
        <div className="flex flex-1 ">
          <div className="w-[270px]  h-full border-l border-[#E4E7EC] bg-white">
            <SideBar />
          </div>
          <div className="flex-1 h-full max-h-full p-4 z-[1]">
            <MainPage questionData={questionData} />
          </div>
        </div>
        <div className="border-b  bg-white border-t border-[#E4E7EC]">
          <BottomBar onSubmit={onSubmit} />
        </div>
      </div>
    </EditorProvider>
  );
}
