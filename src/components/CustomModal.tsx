import { Dialog } from "@mui/material";
import type { DialogProps } from "@mui/material";
import React from "react";
type props = React.PropsWithChildren<{ open: boolean; onClose: () => void }>;

export default function CustomModal({ children, open, onClose }: props) {
  const handleClose: DialogProps["onClose"] = (_, reason) => {
    if (reason && reason === "backdropClick") {
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={handleClose}>
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </Dialog>
  );
}
