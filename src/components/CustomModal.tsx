import { Modal } from "@mui/material";
import React from "react";
type props = React.PropsWithChildren<{ open: boolean; onClose: () => void }>;

export default function CustomModal({ children, open, onClose }: props) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-full h-full flex items-center justify-center">
        {" "}
        {children as any}
      </div>
    </Modal>
  );
}
