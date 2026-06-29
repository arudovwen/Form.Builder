import { Routes, Route } from "react-router";
import { Toaster } from "sonner";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
];

const questionDa = [
];

function App() {
  const dummyTemplates = [
    {
      id: "tpl-1",
      name: "Simple Contact Form",
      description: "A basic form to collect user contact info.",
      sections: [
        {
          id: "sec-contact",
          title: "Contact Info",
          description: "Please fill in your details",
          questionData: [
            { id: "q-name", type: "textField", label: "Text Field", inputLabel: "Full Name", inputType: "text" },
            { id: "q-email", type: "textField", label: "Text Field", inputLabel: "Email Address", inputType: "email" },
            { id: "q-phone", type: "phoneNumber", label: "Phone Number", inputLabel: "Phone Number" }
          ]
        }
      ]
    },
    {
      id: "tpl-2",
      name: "Feedback Form",
      description: "Collect user feedback.",
      sections: [
        {
          id: "sec-feedback",
          title: "Your Feedback",
          questionData: [
            { id: "q-rating", type: "numberField", label: "Number", inputLabel: "Rating (1-5)", inputType: "number" },
            { id: "q-comments", type: "longText", label: "Long Text Field", inputLabel: "Additional Comments", inputType: "text" }
          ]
        }
      ]
    },
    {
      id: "tpl-3",
      name: "Event Registration",
      description: "Register attendees for an upcoming event.",
      sections: [
        {
          id: "sec-event-reg",
          title: "Event Registration",
          questionData: [
            { id: "q-fname", type: "textField", label: "Text Field", inputLabel: "First Name", inputType: "text" },
            { id: "q-lname", type: "textField", label: "Text Field", inputLabel: "Last Name", inputType: "text" },
            { id: "q-company", type: "textField", label: "Text Field", inputLabel: "Company", inputType: "text" },
            { id: "q-diet", type: "textField", label: "Text Field", inputLabel: "Dietary Requirements", inputType: "text" }
          ]
        }
      ]
    },
    {
      id: "tpl-4",
      name: "Job Application",
      description: "Standard job application form.",
      sections: [
        {
          id: "sec-job",
          title: "Job Application",
          questionData: [
            { id: "q-applicant", type: "textField", label: "Text Field", inputLabel: "Full Name", inputType: "text" },
            { id: "q-portfolio", type: "textField", label: "Text Field", inputLabel: "Portfolio URL", inputType: "url" },
            { id: "q-cover", type: "longText", label: "Long Text Field", inputLabel: "Cover Letter", inputType: "text" },
            { id: "q-resume", type: "fileUpload", label: "File Upload", inputLabel: "Upload Resume" }
          ]
        }
      ]
    },
    {
      id: "tpl-5",
      name: "Customer Satisfaction Survey",
      description: "Measure customer satisfaction (CSAT).",
      sections: [
        {
          id: "sec-csat",
          title: "CSAT Survey",
          questionData: [
            { id: "q-csat-rate", type: "numberField", label: "Number", inputLabel: "How satisfied are you with our service? (1-10)", inputType: "number" },
            { id: "q-csat-recommend", type: "radio", label: "Radio", inputLabel: "Would you recommend us?", options: [{ label: "Yes", value: "yes" }, { label: "No", value: "no" }] }
          ]
        }
      ]
    },
    {
      id: "tpl-6",
      name: "Maintenance Request",
      description: "Submit a property or IT maintenance request.",
      sections: [
        {
          id: "sec-maintenance",
          title: "Maintenance Details",
          questionData: [
            { id: "q-maint-loc", type: "textField", label: "Text Field", inputLabel: "Location / Room", inputType: "text" },
            { id: "q-maint-desc", type: "longText", label: "Long Text Field", inputLabel: "Issue Description", inputType: "text" },
            { id: "q-maint-urgency", type: "select", label: "Select", inputLabel: "Urgency Level", options: [{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }] }
          ]
        }
      ]
    },
    {
      id: "tpl-7",
      name: "Product Order Form",
      description: "Basic order form for merchandise or products.",
      sections: [
        {
          id: "sec-order-info",
          title: "Customer Info",
          questionData: [
            { id: "q-order-name", type: "textField", label: "Text Field", inputLabel: "Name", inputType: "text" },
            { id: "q-order-address", type: "longText", label: "Long Text Field", inputLabel: "Shipping Address", inputType: "text" }
          ]
        },
        {
          id: "sec-order-details",
          title: "Order Details",
          questionData: [
            { id: "q-order-item", type: "textField", label: "Text Field", inputLabel: "Item Name", inputType: "text" },
            { id: "q-order-qty", type: "numberField", label: "Number", inputLabel: "Quantity", inputType: "number" }
          ]
        }
      ]
    },
    {
      id: "tpl-8",
      name: "Employee Onboarding",
      description: "Collect info for new hires.",
      sections: [
        {
          id: "sec-onboard",
          title: "Employee Details",
          questionData: [
            { id: "q-emp-name", type: "textField", label: "Text Field", inputLabel: "Legal Name", inputType: "text" },
            { id: "q-emp-start", type: "datePicker", label: "Date Picker", inputLabel: "Start Date" },
            { id: "q-emp-dept", type: "textField", label: "Text Field", inputLabel: "Department", inputType: "text" }
          ]
        }
      ]
    },
    {
      id: "tpl-9",
      name: "Support Ticket",
      description: "IT or customer support ticket form.",
      sections: [
        {
          id: "sec-support",
          title: "Issue Details",
          questionData: [
            { id: "q-sup-subject", type: "textField", label: "Text Field", inputLabel: "Subject", inputType: "text" },
            { id: "q-sup-body", type: "longText", label: "Long Text Field", inputLabel: "Description", inputType: "text" },
            { id: "q-sup-file", type: "fileUpload", label: "File Upload", inputLabel: "Attach Screenshot" }
          ]
        }
      ]
    },
    {
      id: "tpl-10",
      name: "Course Evaluation",
      description: "Student feedback for a course.",
      sections: [
        {
          id: "sec-course",
          title: "Course Evaluation",
          questionData: [
            { id: "q-course-name", type: "textField", label: "Text Field", inputLabel: "Course Name", inputType: "text" },
            { id: "q-course-rate", type: "numberField", label: "Number", inputLabel: "Course Rating (1-10)", inputType: "number" },
            { id: "q-course-improve", type: "longText", label: "Long Text Field", inputLabel: "What could be improved?", inputType: "text" }
          ]
        }
      ]
    }
  ];

  const config = {
    buttonColor: "blue",
    loaderColor: "blue",
    elementColor: "blue",
    elementBgColor: "",
    elementBorderColor: "blue",
  };
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route
          path="/"
          element={
            <div className="h-screen">
              <BulderPage
                onSubmit={function (e: any): void {
                  console.log(e);
                }}
                onPublish={function (e: any): void {
                  console.log(e);
                }}
                questionData={questionDa}
                config={config}
                title="Form Title"
                goBackUrl={() => undefined}
                onAddTemplate={() => alert('Add template clicked!')}
                templates={dummyTemplates}
              />
            </div>
          }
        />
        <Route
          path="/viewer"
          element={
            <ViewerPage
              onSubmit={function (e: any): void {
                console.log(e);
              }}
              answerData={answerData}
              form_data={questionDa}
              config={config}
              loading={false}
              renderType={"multi"}
              onGetValues={(val: any) => {
                console.log(val);
              }}
              
            >
              {/* <div className="text-center w-full">
                <p>This is a child component</p>
              </div> */}
            </ViewerPage>
          }
        />
      </Routes>
    </>
  );
}

export default App;
