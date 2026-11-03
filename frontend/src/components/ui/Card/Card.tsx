import { Paper, type PaperProps } from "@mui/material";

interface CardProps extends PaperProps {
  padding?: number;
}

export function Card({ padding = 2, sx, children, ...rest }: CardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: padding,
        borderRadius: 2,
        border: "1px solid #26262a",
        background: "#1a1a1c",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Paper>
  );
}