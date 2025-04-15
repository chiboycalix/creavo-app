import React from "react";
import { TooltipRenderProps } from "react-joyride";
import { X } from "lucide-react";

export default function CustomTooltip({
  index,
  step,
  size,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}: TooltipRenderProps) {
  return (
    <div
      {...tooltipProps}
      style={{
        position: "relative",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "450px",
      }}
    >
      {/* Close Button */}
      <button
        {...closeProps}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "transparent",
          border: "none",
          fontSize: "18px",
          cursor: "pointer",
          color: "#999",
        }}
      >
        <X size={20} />
      </button>

      <div style={{ marginBottom: "12px" }}>{step.content}</div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "14px" }}>
          Step {index + 1} of {size}
        </span>
        <button
          {...primaryProps}
          style={{
            backgroundColor: "#006295",
            color: "#fff",
            fontSize: "14px",
            padding: "6px 16px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {index === size - 1 ? "Done" : "Next"}
        </button>
      </div>
    </div>
  );
}
