import React, { createContext, useEffect, useState } from "react";

interface WidthContextValue {
  width: boolean;
  setWidth: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultValue: WidthContextValue = {
  width: false,
  setWidth: () => {},
};

export const WidthContext = createContext<WidthContextValue>(defaultValue);

export const WidthProvider = ({ children }: { children: React.ReactNode }) => {
  const [width, setWidth] = useState<boolean>(() => {
    const storedWidth = localStorage.getItem("width");
    return storedWidth !== null ? JSON.parse(storedWidth) : defaultValue.width;
  });

  useEffect(() => {
    localStorage.setItem("width", JSON.stringify(width));
  }, [width]);

  return (
    <WidthContext.Provider value={{ width, setWidth }}>
      {children}
    </WidthContext.Provider>
  );
};