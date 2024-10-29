"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import StandardButton from "./StandardButton";

const ButtonGroup = ({ track = true, identify = true, join = true }) => {
  const pathname = usePathname();
  const [localIdentify, setLocalIdentify] = useState(identify);
  useEffect(() => {
    if (pathname === "/generategoals") {
      setLocalIdentify(false);
    }
  }, [track, identify, join, pathname]);

  return (
    <div className="flex justify-between items-center gap-x-4 mt-4">
      {track && (
        <div>
          <StandardButton text="Track" type="round" />
        </div>
      )}
      {localIdentify && (
        <div>
          <StandardButton text="Identify" type="round" />
        </div>
      )}
      {join && (
        <div>
          <StandardButton text="About" type="round" />
        </div>
      )}
    </div>
  );
};

export default ButtonGroup;
