export const formatWeight = (weight: number): string => {
  if (weight >= 1000) {
    return `${(weight / 1000).toFixed(2)} kg`;
  } else {
    return `${weight} g`;
  }
};
