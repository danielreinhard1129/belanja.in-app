export const getChangedValues = <T extends Record<string, any>>(
  values: T,
  initialValues: T,
) => {
  return Object.entries(values).reduce((acc: Partial<T>, [key, value]) => {
    const hasChanged = initialValues[key as keyof T] !== value;

    if (hasChanged) {
      acc[key as keyof T] = value;
    }

    return acc;
  }, {});
};