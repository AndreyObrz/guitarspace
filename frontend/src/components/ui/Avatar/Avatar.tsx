import MuiAvatar from "@mui/material/Avatar";

interface AvatarProps {
  name?: string;
  src?: string;
  size?: number;
}

function getInitials(name?: string) {
  if (!name) return "??";
  const [a = "", b = ""] = name.trim().split(/\s+/);
  return (a[0] ?? "").concat(b[0] ?? "").toUpperCase();
}

export function Avatar({ name, src, size = 40 }: AvatarProps) {
  return (
    <MuiAvatar
      src={src}
      alt={name}
      sx={{
        width: size,
        height: size,
        bgcolor: "primary.main",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.4,
        pb: "2px",
      }}
    >
      {getInitials(name)}
    </MuiAvatar>
  );
}