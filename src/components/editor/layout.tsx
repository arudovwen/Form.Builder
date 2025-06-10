import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainPage from "./main";
import SideBar from "./sidebar";
import TopBar from "./topbar";
import { EditorProvider } from "../../context/editor-context";
import Loader from "../Loader";

export interface BuilderProps {
  onSubmit: (e: any) => void; // Function to handle form submission
  questionData?: any; // Data for the questions in the form
  isReadOnly?: boolean; // Flag to indicate if the form is read-only
  config?: any; // Configuration for the form
  title?: string;
  loading?: boolean;
  goBackUrl?: () => void;
}

export default function Layout({
  onSubmit,
  questionData,
  title,
  goBackUrl,
  loading,
}: BuilderProps) {
  return (
    <EditorProvider>
      <div className="w-full h-full bg-[#E4E7EC] flex flex-col">
        <ToastContainer />
        <div className="border-b  bg-white  border-[#E4E7EC]">
          <TopBar title={title} goBackUrl={goBackUrl} onSubmit={onSubmit} />
        </div>
        <div className="flex flex-1 p-4 gap-x-4">
          <div>
            <div className="w-[270px]   border border-[#E4E7EC] bg-white   max-h-[calc(100vh-100px)] overflow-y-auto side_shadow rounded-lg no-scrollbar">
              <SideBar />
            </div>
          </div>
          <div className="flex-1 h-full max-h-full z-[1] ">
            {!loading ? (
              <MainPage questionData={questionData} />
            ) : (
              <Loader loadingClass="!w-full !h-[800px]" />
            )}
          </div>
        </div>
      </div>
    </EditorProvider>
  );
}
