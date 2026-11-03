import { Box, LinearProgress } from "@mui/material";

interface ProgressBarProps {
  value: number; // 0..100
  height?: number;
}

export function ProgressBar({ value, height = 8 }: ProgressBarProps) {
  const safe = Math.min(100, Math.max(0, value));

  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant="determinate"
        value={safe}
        sx={{
          height,
          borderRadius: 999,
          bgcolor: "#26262a",
          "& .MuiLinearProgress-bar": {
            borderRadius: 999,
            background: "linear-gradient(90deg, #ff6a1a, #ff8f4d)",
          },
        }}
      />
    </Box>
  );
}