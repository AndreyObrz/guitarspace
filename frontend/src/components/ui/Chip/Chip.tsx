import MuiChip from "@mui/material/Chip";

interface ChipProps {
  label: string;
  color?: "default" | "primary" | "success" | "warning" | "info";
  variant?: "filled" | "outlined";
}

export function Chip({ label, color = "default", variant = "filled" }: ChipProps) {
  return (
    <MuiChip
      label={label}
      color={color}
      variant={variant}
      size="small"
      sx={{ fontWeight: 600, letterSpacing: 0.4 }}
    />
  );
}