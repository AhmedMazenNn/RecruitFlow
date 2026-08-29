import React, { createContext, useContext, useMemo, useState } from 'react';

export type SheetName = 'add-candidate' | 'create-job' | 'schedule-interview' | null;

interface UiContextValue {
  sheet: SheetName;
  open: (sheet: Exclude<SheetName, null>) => void;
  close: () => void;
}

const UiContext = createContext<UiContextValue>({ sheet: null, open: () => undefined, close: () => undefined });

export function UiProvider({ children }: {children: React.ReactNode;}) {
  const [sheet, setSheet] = useState<SheetName>(null);
  const value = useMemo(
    () => ({ sheet, open: (s: Exclude<SheetName, null>) => setSheet(s), close: () => setSheet(null) }),
    [sheet]
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export const useUi = () => useContext(UiContext);