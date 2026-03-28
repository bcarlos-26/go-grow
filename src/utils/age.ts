export function ageAt(birthday: string, measurementDate: string): string {
  const months = Math.round(
    (new Date(measurementDate).getTime() - new Date(birthday).getTime()) /
      ((365.25 / 12) * 86400000)
  );
  if (months < 0) return "";
  const years = Math.floor(months / 12);
  const mo = months % 12;
  if (years === 0) return `${months}mo`;
  if (mo === 0) return `${years}y`;
  return `${years}y ${mo}mo`;
}
