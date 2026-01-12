import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

function Select({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const theme = useSelector((state) => state.theme.theme);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative w-44">
      <label className={`absolute -top-2 left-3 px-1 text-[10px] tracking-widest uppercase ${theme === "dark" ? "bg-gray-950 text-gray-500" : "bg-gray-100 text-gray-700"}`}>
        {label}
      </label>

      <button
        onClick={() => setOpen(!open)}
        className={`
          w-full flex items-center justify-between text-sm
          border rounded-xl px-4 py-2.5 transition
          focus:outline-none focus:ring-2 focus:ring-blue-500/40
          ${theme === "dark"
            ? "bg-slate-800 text-gray-200 border-gray-800 hover:border-gray-700"
            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
          }
        `}
      >
        {selected?.label}
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180 text-blue-400" : "text-gray-400"}`}
        />
      </button>

      {open && (
        <div
          className={`
            absolute z-50 mt-2 w-full
            border rounded-xl shadow-xl overflow-hidden
            animate-in fade-in slide-in-from-top-1
            ${theme === "dark" ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}
          `}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`
                px-4 py-2.5 text-sm cursor-pointer transition
                ${value === opt.value
                  ? "bg-blue-600/10 text-blue-400"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

Select.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Select;
