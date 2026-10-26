"use client";

import { useEffect, useState } from "react";

export function CopyrightYear() {
  const [year, setYear] = useState<number | null>(null);

  // `new Date()` is unstable during prerendering — read it after mount.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ساڵی وەر هەڵبژانراوە دوای ڕێندەرکردن
    setYear(new Date().getFullYear());
  }, []);

  return year ? <>{year}</> : null;
}
