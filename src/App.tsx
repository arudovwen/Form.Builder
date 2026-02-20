import { Routes, Route } from "react-router";
import BulderPage from "./pages/builder";
import ViewerPage from "./pages/viewer";
import "./assets/scss/style.scss";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const answerData = [
  {
    id: "a35e2a4b-9c67-4d2c-8968-7119cda1f05f",
    sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    type: "textField",
    value: "Jane Doe",
    files: null,
  },
  {
    id: "c4706623-1eb0-4bf9-9e5b-b669c1ce0583",
    sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    type: "textField",
    value: "24 yrs",
    files: null,
  },
  {
    id: "961063dd-87fb-4813-a7fd-f1eb3b6f6c75",
    sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    type: "date",
    value: "2026-02-19T23:00:00.000Z",
    files: null,
  },
  {
    id: "df8165cf-9a3f-4b1f-8207-aba27766678a",
    sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    type: "country",
    value: "Baghlān, Afghanistan",
    files: null,
  },
  {
    id: "284ef2d5-d48d-4226-8e67-df84071d02f7",
    sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    type: "file",
    value: null,
    files: null,
  },
  {
    id: "0e6c543a-cef6-4f58-b143-fb35829c8ebf",
    sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    type: "dataGrid",
    value: [
      {
        firstName: "Talkewr",
        lastName: "Doer",
        age: "18yrs",
        dob: "21-05-1993",
        id: "be8689f6-72d6-442b-8e94-256aea731b4e",
      },
    ],
    files: null,
  },
];

const questionDa = [
  {
    title: "",
    description: "",
    id: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
    questionData: [
      {
        type: "textField",
        label: "Text Field",
        icon: "fluent:text-16-filled",
        inputLabel: "Name",
        required: false,
        inputType: "text",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: null,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        id: "a35e2a4b-9c67-4d2c-8968-7119cda1f05f",
        sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
        dateType: "basic",
        selectType: "list",
        options1: [],
        options: [],
        dataColumns: [],
      },
      {
        type: "textField",
        label: "Text Field",
        icon: "fluent:text-16-filled",
        inputLabel: "Age",
        required: false,
        inputType: "text",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: null,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        id: "c4706623-1eb0-4bf9-9e5b-b669c1ce0583",
        sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
        dateType: "basic",
        selectType: "list",
        options1: [],
        options: [],
        dataColumns: [],
      },
      {
        type: "date",
        label: "Date",
        icon: "bx:calendar",
        inputLabel: "Date Text Label",
        required: false,
        inputType: "date",
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        description: "",
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        value: null,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        inputMode: "date",
        dateType: "basic",
        dateFormat: "dd/MM/yyyy",
        id: "961063dd-87fb-4813-a7fd-f1eb3b6f6c75",
        sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
        isHidden: false,
        allowYearPicker: true,
        canHaveDateRange: false,
        selectType: "list",
        options1: [],
        options: [],
        dataColumns: [],
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        isHidden: false,
        visibilityDependentFields: [],
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        type: "country",
        label: "Country",
        icon: "fluent:globe-16-regular",
        inputLabel: "Select Country",
        inputType: "country",
        options: [
          {
            label: "Afghanistan",
            value: "Afghanistan",
            id: "Afghanistan",
          },
          {
            label: "Åland Islands",
            value: "Åland Islands",
            id: "Åland Islands",
          },
          {
            label: "Albania",
            value: "Albania",
            id: "Albania",
          },
          {
            label: "Algeria",
            value: "Algeria",
            id: "Algeria",
          },
          {
            label: "American Samoa",
            value: "American Samoa",
            id: "American Samoa",
          },
          {
            label: "Andorra",
            value: "Andorra",
            id: "Andorra",
          },
          {
            label: "Angola",
            value: "Angola",
            id: "Angola",
          },
          {
            label: "Anguilla",
            value: "Anguilla",
            id: "Anguilla",
          },
          {
            label: "Antarctica",
            value: "Antarctica",
            id: "Antarctica",
          },
          {
            label: "Antigua and Barbuda",
            value: "Antigua and Barbuda",
            id: "Antigua and Barbuda",
          },
          {
            label: "Argentina",
            value: "Argentina",
            id: "Argentina",
          },
          {
            label: "Armenia",
            value: "Armenia",
            id: "Armenia",
          },
          {
            label: "Aruba",
            value: "Aruba",
            id: "Aruba",
          },
          {
            label: "Australia",
            value: "Australia",
            id: "Australia",
          },
          {
            label: "Austria",
            value: "Austria",
            id: "Austria",
          },
          {
            label: "Azerbaijan",
            value: "Azerbaijan",
            id: "Azerbaijan",
          },
          {
            label: "The Bahamas",
            value: "The Bahamas",
            id: "The Bahamas",
          },
          {
            label: "Bahrain",
            value: "Bahrain",
            id: "Bahrain",
          },
          {
            label: "Bangladesh",
            value: "Bangladesh",
            id: "Bangladesh",
          },
          {
            label: "Barbados",
            value: "Barbados",
            id: "Barbados",
          },
          {
            label: "Belarus",
            value: "Belarus",
            id: "Belarus",
          },
          {
            label: "Belgium",
            value: "Belgium",
            id: "Belgium",
          },
          {
            label: "Belize",
            value: "Belize",
            id: "Belize",
          },
          {
            label: "Benin",
            value: "Benin",
            id: "Benin",
          },
          {
            label: "Bermuda",
            value: "Bermuda",
            id: "Bermuda",
          },
          {
            label: "Bhutan",
            value: "Bhutan",
            id: "Bhutan",
          },
          {
            label: "Bolivia",
            value: "Bolivia",
            id: "Bolivia",
          },
          {
            label: "Bonaire",
            value: "Bonaire",
            id: "Bonaire",
          },
          {
            label: "Bosnia and Herzegovina",
            value: "Bosnia and Herzegovina",
            id: "Bosnia and Herzegovina",
          },
          {
            label: "Botswana",
            value: "Botswana",
            id: "Botswana",
          },
          {
            label: "Bouvet Island",
            value: "Bouvet Island",
            id: "Bouvet Island",
          },
          {
            label: "Brazil",
            value: "Brazil",
            id: "Brazil",
          },
          {
            label: "British Indian Ocean Territory",
            value: "British Indian Ocean Territory",
            id: "British Indian Ocean Territory",
          },
          {
            label: "United States Minor Outlying Islands",
            value: "United States Minor Outlying Islands",
            id: "United States Minor Outlying Islands",
          },
          {
            label: "Virgin Islands (British)",
            value: "Virgin Islands (British)",
            id: "Virgin Islands (British)",
          },
          {
            label: "Virgin Islands (U.S.)",
            value: "Virgin Islands (U.S.)",
            id: "Virgin Islands (U.S.)",
          },
          {
            label: "Brunei",
            value: "Brunei",
            id: "Brunei",
          },
          {
            label: "Bulgaria",
            value: "Bulgaria",
            id: "Bulgaria",
          },
          {
            label: "Burkina Faso",
            value: "Burkina Faso",
            id: "Burkina Faso",
          },
          {
            label: "Burundi",
            value: "Burundi",
            id: "Burundi",
          },
          {
            label: "Cambodia",
            value: "Cambodia",
            id: "Cambodia",
          },
          {
            label: "Cameroon",
            value: "Cameroon",
            id: "Cameroon",
          },
          {
            label: "Canada",
            value: "Canada",
            id: "Canada",
          },
          {
            label: "Cape Verde",
            value: "Cape Verde",
            id: "Cape Verde",
          },
          {
            label: "Cayman Islands",
            value: "Cayman Islands",
            id: "Cayman Islands",
          },
          {
            label: "Central African Republic",
            value: "Central African Republic",
            id: "Central African Republic",
          },
          {
            label: "Chad",
            value: "Chad",
            id: "Chad",
          },
          {
            label: "Chile",
            value: "Chile",
            id: "Chile",
          },
          {
            label: "China",
            value: "China",
            id: "China",
          },
          {
            label: "Christmas Island",
            value: "Christmas Island",
            id: "Christmas Island",
          },
          {
            label: "Cocos (Keeling) Islands",
            value: "Cocos (Keeling) Islands",
            id: "Cocos (Keeling) Islands",
          },
          {
            label: "Colombia",
            value: "Colombia",
            id: "Colombia",
          },
          {
            label: "Comoros",
            value: "Comoros",
            id: "Comoros",
          },
          {
            label: "Republic of the Congo",
            value: "Republic of the Congo",
            id: "Republic of the Congo",
          },
          {
            label: "Democratic Republic of the Congo",
            value: "Democratic Republic of the Congo",
            id: "Democratic Republic of the Congo",
          },
          {
            label: "Cook Islands",
            value: "Cook Islands",
            id: "Cook Islands",
          },
          {
            label: "Costa Rica",
            value: "Costa Rica",
            id: "Costa Rica",
          },
          {
            label: "Croatia",
            value: "Croatia",
            id: "Croatia",
          },
          {
            label: "Cuba",
            value: "Cuba",
            id: "Cuba",
          },
          {
            label: "Curaçao",
            value: "Curaçao",
            id: "Curaçao",
          },
          {
            label: "Cyprus",
            value: "Cyprus",
            id: "Cyprus",
          },
          {
            label: "Czech Republic",
            value: "Czech Republic",
            id: "Czech Republic",
          },
          {
            label: "Denmark",
            value: "Denmark",
            id: "Denmark",
          },
          {
            label: "Djibouti",
            value: "Djibouti",
            id: "Djibouti",
          },
          {
            label: "Dominica",
            value: "Dominica",
            id: "Dominica",
          },
          {
            label: "Dominican Republic",
            value: "Dominican Republic",
            id: "Dominican Republic",
          },
          {
            label: "Ecuador",
            value: "Ecuador",
            id: "Ecuador",
          },
          {
            label: "Egypt",
            value: "Egypt",
            id: "Egypt",
          },
          {
            label: "El Salvador",
            value: "El Salvador",
            id: "El Salvador",
          },
          {
            label: "Equatorial Guinea",
            value: "Equatorial Guinea",
            id: "Equatorial Guinea",
          },
          {
            label: "Eritrea",
            value: "Eritrea",
            id: "Eritrea",
          },
          {
            label: "Estonia",
            value: "Estonia",
            id: "Estonia",
          },
          {
            label: "Ethiopia",
            value: "Ethiopia",
            id: "Ethiopia",
          },
          {
            label: "Falkland Islands",
            value: "Falkland Islands",
            id: "Falkland Islands",
          },
          {
            label: "Faroe Islands",
            value: "Faroe Islands",
            id: "Faroe Islands",
          },
          {
            label: "Fiji",
            value: "Fiji",
            id: "Fiji",
          },
          {
            label: "Finland",
            value: "Finland",
            id: "Finland",
          },
          {
            label: "France",
            value: "France",
            id: "France",
          },
          {
            label: "French Guiana",
            value: "French Guiana",
            id: "French Guiana",
          },
          {
            label: "French Polynesia",
            value: "French Polynesia",
            id: "French Polynesia",
          },
          {
            label: "French Southern and Antarctic Lands",
            value: "French Southern and Antarctic Lands",
            id: "French Southern and Antarctic Lands",
          },
          {
            label: "Gabon",
            value: "Gabon",
            id: "Gabon",
          },
          {
            label: "The Gambia",
            value: "The Gambia",
            id: "The Gambia",
          },
          {
            label: "Georgia",
            value: "Georgia",
            id: "Georgia",
          },
          {
            label: "Germany",
            value: "Germany",
            id: "Germany",
          },
          {
            label: "Ghana",
            value: "Ghana",
            id: "Ghana",
          },
          {
            label: "Gibraltar",
            value: "Gibraltar",
            id: "Gibraltar",
          },
          {
            label: "Greece",
            value: "Greece",
            id: "Greece",
          },
          {
            label: "Greenland",
            value: "Greenland",
            id: "Greenland",
          },
          {
            label: "Grenada",
            value: "Grenada",
            id: "Grenada",
          },
          {
            label: "Guadeloupe",
            value: "Guadeloupe",
            id: "Guadeloupe",
          },
          {
            label: "Guam",
            value: "Guam",
            id: "Guam",
          },
          {
            label: "Guatemala",
            value: "Guatemala",
            id: "Guatemala",
          },
          {
            label: "Guernsey",
            value: "Guernsey",
            id: "Guernsey",
          },
          {
            label: "Guinea",
            value: "Guinea",
            id: "Guinea",
          },
          {
            label: "Guinea-Bissau",
            value: "Guinea-Bissau",
            id: "Guinea-Bissau",
          },
          {
            label: "Guyana",
            value: "Guyana",
            id: "Guyana",
          },
          {
            label: "Haiti",
            value: "Haiti",
            id: "Haiti",
          },
          {
            label: "Heard Island and McDonald Islands",
            value: "Heard Island and McDonald Islands",
            id: "Heard Island and McDonald Islands",
          },
          {
            label: "Holy See",
            value: "Holy See",
            id: "Holy See",
          },
          {
            label: "Honduras",
            value: "Honduras",
            id: "Honduras",
          },
          {
            label: "Hong Kong",
            value: "Hong Kong",
            id: "Hong Kong",
          },
          {
            label: "Hungary",
            value: "Hungary",
            id: "Hungary",
          },
          {
            label: "Iceland",
            value: "Iceland",
            id: "Iceland",
          },
          {
            label: "India",
            value: "India",
            id: "India",
          },
          {
            label: "Indonesia",
            value: "Indonesia",
            id: "Indonesia",
          },
          {
            label: "Cote d'Ivoire",
            value: "Cote d'Ivoire",
            id: "Cote d'Ivoire",
          },
          {
            label: "Iran",
            value: "Iran",
            id: "Iran",
          },
          {
            label: "Iraq",
            value: "Iraq",
            id: "Iraq",
          },
          {
            label: "Republic of Ireland",
            value: "Republic of Ireland",
            id: "Republic of Ireland",
          },
          {
            label: "Isle of Man",
            value: "Isle of Man",
            id: "Isle of Man",
          },
          {
            label: "Israel",
            value: "Israel",
            id: "Israel",
          },
          {
            label: "Italy",
            value: "Italy",
            id: "Italy",
          },
          {
            label: "Jamaica",
            value: "Jamaica",
            id: "Jamaica",
          },
          {
            label: "Japan",
            value: "Japan",
            id: "Japan",
          },
          {
            label: "Jersey",
            value: "Jersey",
            id: "Jersey",
          },
          {
            label: "Jordan",
            value: "Jordan",
            id: "Jordan",
          },
          {
            label: "Kazakhstan",
            value: "Kazakhstan",
            id: "Kazakhstan",
          },
          {
            label: "Kenya",
            value: "Kenya",
            id: "Kenya",
          },
          {
            label: "Kiribati",
            value: "Kiribati",
            id: "Kiribati",
          },
          {
            label: "Kuwait",
            value: "Kuwait",
            id: "Kuwait",
          },
          {
            label: "Kyrgyzstan",
            value: "Kyrgyzstan",
            id: "Kyrgyzstan",
          },
          {
            label: "Laos",
            value: "Laos",
            id: "Laos",
          },
          {
            label: "Latvia",
            value: "Latvia",
            id: "Latvia",
          },
          {
            label: "Lebanon",
            value: "Lebanon",
            id: "Lebanon",
          },
          {
            label: "Lesotho",
            value: "Lesotho",
            id: "Lesotho",
          },
          {
            label: "Liberia",
            value: "Liberia",
            id: "Liberia",
          },
          {
            label: "Libya",
            value: "Libya",
            id: "Libya",
          },
          {
            label: "Liechtenstein",
            value: "Liechtenstein",
            id: "Liechtenstein",
          },
          {
            label: "Lithuania",
            value: "Lithuania",
            id: "Lithuania",
          },
          {
            label: "Luxembourg",
            value: "Luxembourg",
            id: "Luxembourg",
          },
          {
            label: "Macau",
            value: "Macau",
            id: "Macau",
          },
          {
            label: "Republic of Macedonia",
            value: "Republic of Macedonia",
            id: "Republic of Macedonia",
          },
          {
            label: "Madagascar",
            value: "Madagascar",
            id: "Madagascar",
          },
          {
            label: "Malawi",
            value: "Malawi",
            id: "Malawi",
          },
          {
            label: "Malaysia",
            value: "Malaysia",
            id: "Malaysia",
          },
          {
            label: "Maldives",
            value: "Maldives",
            id: "Maldives",
          },
          {
            label: "Mali",
            value: "Mali",
            id: "Mali",
          },
          {
            label: "Malta",
            value: "Malta",
            id: "Malta",
          },
          {
            label: "Marshall Islands",
            value: "Marshall Islands",
            id: "Marshall Islands",
          },
          {
            label: "Martinique",
            value: "Martinique",
            id: "Martinique",
          },
          {
            label: "Mauritania",
            value: "Mauritania",
            id: "Mauritania",
          },
          {
            label: "Mauritius",
            value: "Mauritius",
            id: "Mauritius",
          },
          {
            label: "Mayotte",
            value: "Mayotte",
            id: "Mayotte",
          },
          {
            label: "Mexico",
            value: "Mexico",
            id: "Mexico",
          },
          {
            label: "Federated States of Micronesia",
            value: "Federated States of Micronesia",
            id: "Federated States of Micronesia",
          },
          {
            label: "Moldova",
            value: "Moldova",
            id: "Moldova",
          },
          {
            label: "Monaco",
            value: "Monaco",
            id: "Monaco",
          },
          {
            label: "Mongolia",
            value: "Mongolia",
            id: "Mongolia",
          },
          {
            label: "Montenegro",
            value: "Montenegro",
            id: "Montenegro",
          },
          {
            label: "Montserrat",
            value: "Montserrat",
            id: "Montserrat",
          },
          {
            label: "Morocco",
            value: "Morocco",
            id: "Morocco",
          },
          {
            label: "Mozambique",
            value: "Mozambique",
            id: "Mozambique",
          },
          {
            label: "Myanmar",
            value: "Myanmar",
            id: "Myanmar",
          },
          {
            label: "Namibia",
            value: "Namibia",
            id: "Namibia",
          },
          {
            label: "Nauru",
            value: "Nauru",
            id: "Nauru",
          },
          {
            label: "Nepal",
            value: "Nepal",
            id: "Nepal",
          },
          {
            label: "Netherlands",
            value: "Netherlands",
            id: "Netherlands",
          },
          {
            label: "New Caledonia",
            value: "New Caledonia",
            id: "New Caledonia",
          },
          {
            label: "New Zealand",
            value: "New Zealand",
            id: "New Zealand",
          },
          {
            label: "Nicaragua",
            value: "Nicaragua",
            id: "Nicaragua",
          },
          {
            label: "Niger",
            value: "Niger",
            id: "Niger",
          },
          {
            label: "Nigeria",
            value: "Nigeria",
            id: "Nigeria",
          },
          {
            label: "Niue",
            value: "Niue",
            id: "Niue",
          },
          {
            label: "Norfolk Island",
            value: "Norfolk Island",
            id: "Norfolk Island",
          },
          {
            label: "North Korea",
            value: "North Korea",
            id: "North Korea",
          },
          {
            label: "Northern Mariana Islands",
            value: "Northern Mariana Islands",
            id: "Northern Mariana Islands",
          },
          {
            label: "Norway",
            value: "Norway",
            id: "Norway",
          },
          {
            label: "Oman",
            value: "Oman",
            id: "Oman",
          },
          {
            label: "Pakistan",
            value: "Pakistan",
            id: "Pakistan",
          },
          {
            label: "Palau",
            value: "Palau",
            id: "Palau",
          },
          {
            label: "Palestine",
            value: "Palestine",
            id: "Palestine",
          },
          {
            label: "Panama",
            value: "Panama",
            id: "Panama",
          },
          {
            label: "Papua New Guinea",
            value: "Papua New Guinea",
            id: "Papua New Guinea",
          },
          {
            label: "Paraguay",
            value: "Paraguay",
            id: "Paraguay",
          },
          {
            label: "Peru",
            value: "Peru",
            id: "Peru",
          },
          {
            label: "Philippines",
            value: "Philippines",
            id: "Philippines",
          },
          {
            label: "Pitcairn Islands",
            value: "Pitcairn Islands",
            id: "Pitcairn Islands",
          },
          {
            label: "Poland",
            value: "Poland",
            id: "Poland",
          },
          {
            label: "Portugal",
            value: "Portugal",
            id: "Portugal",
          },
          {
            label: "Puerto Rico",
            value: "Puerto Rico",
            id: "Puerto Rico",
          },
          {
            label: "Qatar",
            value: "Qatar",
            id: "Qatar",
          },
          {
            label: "Republic of Kosovo",
            value: "Republic of Kosovo",
            id: "Republic of Kosovo",
          },
          {
            label: "Réunion",
            value: "Réunion",
            id: "Réunion",
          },
          {
            label: "Romania",
            value: "Romania",
            id: "Romania",
          },
          {
            label: "Russia",
            value: "Russia",
            id: "Russia",
          },
          {
            label: "Rwanda",
            value: "Rwanda",
            id: "Rwanda",
          },
          {
            label: "Saint Barthélemy",
            value: "Saint Barthélemy",
            id: "Saint Barthélemy",
          },
          {
            label: "Saint Helena",
            value: "Saint Helena",
            id: "Saint Helena",
          },
          {
            label: "Saint Kitts and Nevis",
            value: "Saint Kitts and Nevis",
            id: "Saint Kitts and Nevis",
          },
          {
            label: "Saint Lucia",
            value: "Saint Lucia",
            id: "Saint Lucia",
          },
          {
            label: "Saint Martin",
            value: "Saint Martin",
            id: "Saint Martin",
          },
          {
            label: "Saint Pierre and Miquelon",
            value: "Saint Pierre and Miquelon",
            id: "Saint Pierre and Miquelon",
          },
          {
            label: "Saint Vincent and the Grenadines",
            value: "Saint Vincent and the Grenadines",
            id: "Saint Vincent and the Grenadines",
          },
          {
            label: "Samoa",
            value: "Samoa",
            id: "Samoa",
          },
          {
            label: "San Marino",
            value: "San Marino",
            id: "San Marino",
          },
          {
            label: "São Tomé and Príncipe",
            value: "São Tomé and Príncipe",
            id: "São Tomé and Príncipe",
          },
          {
            label: "Saudi Arabia",
            value: "Saudi Arabia",
            id: "Saudi Arabia",
          },
          {
            label: "Senegal",
            value: "Senegal",
            id: "Senegal",
          },
          {
            label: "Serbia",
            value: "Serbia",
            id: "Serbia",
          },
          {
            label: "Seychelles",
            value: "Seychelles",
            id: "Seychelles",
          },
          {
            label: "Sierra Leone",
            value: "Sierra Leone",
            id: "Sierra Leone",
          },
          {
            label: "Singapore",
            value: "Singapore",
            id: "Singapore",
          },
          {
            label: "Sint Maarten",
            value: "Sint Maarten",
            id: "Sint Maarten",
          },
          {
            label: "Slovakia",
            value: "Slovakia",
            id: "Slovakia",
          },
          {
            label: "Slovenia",
            value: "Slovenia",
            id: "Slovenia",
          },
          {
            label: "Solomon Islands",
            value: "Solomon Islands",
            id: "Solomon Islands",
          },
          {
            label: "Somalia",
            value: "Somalia",
            id: "Somalia",
          },
          {
            label: "South Africa",
            value: "South Africa",
            id: "South Africa",
          },
          {
            label: "South Georgia",
            value: "South Georgia",
            id: "South Georgia",
          },
          {
            label: "South Korea",
            value: "South Korea",
            id: "South Korea",
          },
          {
            label: "South Sudan",
            value: "South Sudan",
            id: "South Sudan",
          },
          {
            label: "Spain",
            value: "Spain",
            id: "Spain",
          },
          {
            label: "Sri Lanka",
            value: "Sri Lanka",
            id: "Sri Lanka",
          },
          {
            label: "Sudan",
            value: "Sudan",
            id: "Sudan",
          },
          {
            label: "Suriname",
            value: "Suriname",
            id: "Suriname",
          },
          {
            label: "Svalbard and Jan Mayen",
            value: "Svalbard and Jan Mayen",
            id: "Svalbard and Jan Mayen",
          },
          {
            label: "Swaziland",
            value: "Swaziland",
            id: "Swaziland",
          },
          {
            label: "Sweden",
            value: "Sweden",
            id: "Sweden",
          },
          {
            label: "Switzerland",
            value: "Switzerland",
            id: "Switzerland",
          },
          {
            label: "Syria",
            value: "Syria",
            id: "Syria",
          },
          {
            label: "Taiwan",
            value: "Taiwan",
            id: "Taiwan",
          },
          {
            label: "Tajikistan",
            value: "Tajikistan",
            id: "Tajikistan",
          },
          {
            label: "Tanzania",
            value: "Tanzania",
            id: "Tanzania",
          },
          {
            label: "Thailand",
            value: "Thailand",
            id: "Thailand",
          },
          {
            label: "East Timor",
            value: "East Timor",
            id: "East Timor",
          },
          {
            label: "Togo",
            value: "Togo",
            id: "Togo",
          },
          {
            label: "Tokelau",
            value: "Tokelau",
            id: "Tokelau",
          },
          {
            label: "Tonga",
            value: "Tonga",
            id: "Tonga",
          },
          {
            label: "Trinidad and Tobago",
            value: "Trinidad and Tobago",
            id: "Trinidad and Tobago",
          },
          {
            label: "Tunisia",
            value: "Tunisia",
            id: "Tunisia",
          },
          {
            label: "Turkey",
            value: "Turkey",
            id: "Turkey",
          },
          {
            label: "Turkmenistan",
            value: "Turkmenistan",
            id: "Turkmenistan",
          },
          {
            label: "Turks and Caicos Islands",
            value: "Turks and Caicos Islands",
            id: "Turks and Caicos Islands",
          },
          {
            label: "Tuvalu",
            value: "Tuvalu",
            id: "Tuvalu",
          },
          {
            label: "Uganda",
            value: "Uganda",
            id: "Uganda",
          },
          {
            label: "Ukraine",
            value: "Ukraine",
            id: "Ukraine",
          },
          {
            label: "United Arab Emirates",
            value: "United Arab Emirates",
            id: "United Arab Emirates",
          },
          {
            label: "United Kingdom",
            value: "United Kingdom",
            id: "United Kingdom",
          },
          {
            label: "United States",
            value: "United States",
            id: "United States",
          },
          {
            label: "Uruguay",
            value: "Uruguay",
            id: "Uruguay",
          },
          {
            label: "Uzbekistan",
            value: "Uzbekistan",
            id: "Uzbekistan",
          },
          {
            label: "Vanuatu",
            value: "Vanuatu",
            id: "Vanuatu",
          },
          {
            label: "Venezuela",
            value: "Venezuela",
            id: "Venezuela",
          },
          {
            label: "Vietnam",
            value: "Vietnam",
            id: "Vietnam",
          },
          {
            label: "Wallis and Futuna",
            value: "Wallis and Futuna",
            id: "Wallis and Futuna",
          },
          {
            label: "Western Sahara",
            value: "Western Sahara",
            id: "Western Sahara",
          },
          {
            label: "Yemen",
            value: "Yemen",
            id: "Yemen",
          },
          {
            label: "Zambia",
            value: "Zambia",
            id: "Zambia",
          },
          {
            label: "Zimbabwe",
            value: "Zimbabwe",
            id: "Zimbabwe",
          },
        ],
        showState: true,
        id: "df8165cf-9a3f-4b1f-8207-aba27766678a",
        sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
        dateType: "basic",
        selectType: "list",
        options1: [],
        dataColumns: [],
      },
      {
        required: false,
        description: "",
        value: null,
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        isHidden: false,
        visibilityDependentFields: [],
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        type: "file",
        label: "File Attachment",
        icon: "ion:attach-sharp",
        inputLabel: "File Label",
        inputType: "file",
        isMultiple: false,
        acceptedFiles: [],
        id: "284ef2d5-d48d-4226-8e67-df84071d02f7",
        sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
      },
      {
        required: false,
        description: "",
        value: [],
        isReadOnly: false,
        isDisabled: false,
        isRequired: false,
        customClass: "",
        elementClass: "",
        gridPosition: null,
        gridId: null,
        isHidden: false,
        visibilityDependentFields: [],
        maxLength: null,
        minLength: null,
        placeholder: "Type here",
        requiredMessage: "Field is required",
        minLengthMessage: "",
        maxLengthMessage: "",
        type: "dataGrid",
        label: "Data Grid",
        icon: "carbon:data-table",
        inputLabel: "Data Grid Label",
        inputType: "dataGrid",
        dataColumns: [
          {
            field: "firstName",
            headerName: "First Name",
            width: 150,
            editable: true,
            id: "be8689f6-72d6-442b-8e94-256aea731b4e",
          },
          {
            headerName: "Last Name",
            field: "lastName",
            editable: true,
            id: "9e757f07-6bfa-48e0-a05f-8969dba1ab6d",
          },
          {
            headerName: "Age",
            field: "age",
            editable: true,
            id: "cfaa706f-6dc4-4747-b59f-08907f4dd1e7",
          },
          {
            headerName: "DOB",
            field: "dob",
            editable: true,
            id: "a1faa3e2-b681-4255-bfe6-a7167086a001",
          },
        ],
        id: "0e6c543a-cef6-4f58-b143-fb35829c8ebf",
        sectionId: "39b498ac-59c4-4a54-96fc-bcab0daeb89d",
        dateType: "basic",
        selectType: "list",
        options1: [],
        options: [],
      },
    ],
  },
];
function App() {
  // let form_data;

  // // Safely parse formData from localStorage
  // try {
  //   const storedData = localStorage.getItem("formData");
  //   form_data = storedData ? JSON.parse(storedData) : null;
  // } catch (error) {
  //   console.error("Error parsing formData from localStorage:", error);
  //   form_data = null;
  // }
  const config = {
    buttonColor: "blue",
    loaderColor: "blue",
    elementColor: "blue",
    elementBgColor: "",
    elementBorderColor: "blue",
  };
  return (
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
              // questionData={data}
              config={config}
              title="Form Title"
              goBackUrl={() => undefined}
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
            renderType={"single"}
            onGetValues={(val: any) => {
              console.log(val);
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;
