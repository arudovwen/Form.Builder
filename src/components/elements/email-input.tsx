export default function EmailInput({ element }: { element: any }) {
  return (
    <input
      placeholder={element.placeholder}
      type={element.inputType}
      className="input-control"
    />
  );
}
