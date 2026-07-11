// Empty — centered placeholder for empty panels / no-data states.
export function Empty({ message }: { message: string }) {
  return <div className="omv-empty">{message}</div>;
}
