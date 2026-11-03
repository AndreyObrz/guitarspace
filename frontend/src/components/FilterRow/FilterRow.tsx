import clsx from "clsx";
import s from "./FilterRow.module.css";

interface FilterRowProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterRow({ label, options, value, onChange }: FilterRowProps) {
  return (
    <div className={s.row}>
      <span className={s.label}>{label}</span>
      <div className={s.options}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            className={clsx(s.chip, value === opt && s.chipActive)}
            onClick={() => onChange(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}