import React, { useEffect, useState } from "react";

export default function useFetch(src: string) {
  const [progress, setProgress] = useState(0);
  const start = async () => {
    const response = await fetch(src);
    if (!response.body) return;
    const reader = response.body.getReader();

    // Step 2: get total length
    const contentLength = response.headers.get("content-length");
    const totalLength =
      typeof contentLength === "string" && parseInt(contentLength);
    // Step 3: read the data
    let receivedLength = 0; // received that many bytes at the moment
    const chunks = []; // array of received binary chunks (comprises the body)
    while (true) {
      const { done, value } = await reader!.read();
      let step = 0;
      if (done) {
        break;
      }
      chunks.push(value);
      receivedLength += value.length;
      if (typeof totalLength === "number") {
        step = (receivedLength / totalLength) * 100;
        setProgress(step);
      }
    }
  };
  useEffect(() => {
    start();
  }, []);
  return progress;
}
