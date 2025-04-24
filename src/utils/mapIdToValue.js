export function mapIdToValue(answerData) {
  return answerData.reduce((acc, item) => {
    acc[item.id] = item.value;
    return acc;
  }, {});
}
