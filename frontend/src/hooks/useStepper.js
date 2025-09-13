import { useState } from "react";

export default function useStepper(initial = 1) {
  const [step, setStep] = useState(initial);

  const next = () => setStep((prev) => prev + 1);
  const prev = () => setStep((prev) => prev - 1);
  const reset = () => setStep(initial);

  return { step, next, prev, reset };
}
