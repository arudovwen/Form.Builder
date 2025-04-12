
export function mapIdToValue(sections) {
  return sections.reduce((result, section) => {
    section.questionData.forEach((question) => {
      result[question.id] = Object.prototype.hasOwnProperty.call(
        question,
        "value"
      )
        ? question.value
        : null;
    });
    return result;
  }, {});
}
