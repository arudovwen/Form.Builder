import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainPage from "./main";
import SideBar from "./sidebar";
import TopBar from "./topbar";
import { EditorProvider } from "../../context/editor-context";
import Loader from "../Loader";

export interface BuilderProps {
  onSubmit?: (e: any) => void; // Function to handle form submission
  questionData?: any; // Data for the questions in the form
  isReadOnly?: boolean; // Flag to indicate if the form is read-only
  config?: any; // Configuration for the form
  title?: string;
  loading?: boolean;
  goBackUrl?: () => void;
  onPublish?: (e: any) => void;
  previewLoading?: boolean;
  saveLoading?: boolean;
  publishLoading?: boolean;
  onTitleChange?: (string) => void;
}

export default function Layout({
  onSubmit,
  questionData,
  title,
  goBackUrl,
  loading,
  onPublish,
  previewLoading,
  saveLoading,
  publishLoading,
  onTitleChange,
}: BuilderProps) {
  return (
    <EditorProvider>
      <div className="w-full h-full bg-[#F8F9FC] flex flex-col">
        <ToastContainer />
        <div className="border-b  bg-white  border-[#E4E7EC]">
          <TopBar
            title={title}
            goBackUrl={goBackUrl}
            onSubmit={onSubmit}
            onPublish={onPublish}
            previewLoading={previewLoading}
            saveLoading={saveLoading}
            publishLoading={publishLoading}
            onTitleChange={onTitleChange}
          />
        </div>
        <div className="flex flex-1 ">
          <div>
            <div className="w-[260px]  h-[calc(100vh-64px)]  border-r border-[#E4E7EC] bg-white ">
              <SideBar />
            </div>
          </div>
          <div className="flex-1 h-full max-h-full z-[1]  p-4 ">
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
