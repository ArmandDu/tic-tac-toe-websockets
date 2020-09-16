import React from "react";
interface Props {
  children: React.ReactNode;
  open?: boolean;
}

export function AlertModal(props: Props) {
  const { open, children } = props;

  return open ? <div className="alert-message">{children}</div> : null;
}

export default AlertModal;
