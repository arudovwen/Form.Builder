export function mapIdToValue(answerData: any) {
  if (!Array.isArray(answerData)) return {};
  return answerData.reduce((acc: any, item: any) => {
    if (item && item.id) {
      acc[item.id] = item.value;
      if (item.metaData?.responseObject) {
        acc[`${item.id}_metaData`] = item.metaData.responseObject;
      }
    }
    return acc;
  }, {});
}
