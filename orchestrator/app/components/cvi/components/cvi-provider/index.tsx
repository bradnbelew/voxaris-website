'use client';

import { useState } from "react";
import DailyIframe, { type DailyCall } from "@daily-co/daily-js";
import { DailyProvider } from "@daily-co/daily-react";

export const CVIProvider = ({ children }: { children: React.ReactNode }) => {
  const [callObject] = useState<DailyCall>(() =>
    DailyIframe.createCallObject()
  );

  return (
    <DailyProvider callObject={callObject}>
      {children}
    </DailyProvider>
  );
}
