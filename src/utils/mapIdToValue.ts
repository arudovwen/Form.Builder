export function mapIdToValue(answerData:any) {
  return answerData.reduce((acc: any, item: any) => {
    acc[item.id] = item.value;
    return acc;
  }, {});
}
