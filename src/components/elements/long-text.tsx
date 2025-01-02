export default function LongTextInput({ element }: { element: any }) {
  return (
    <textarea
      placeholder={element.placeholder}
      rows={4}
      className="input-control resize-none"
    ></textarea>
  );
}
