import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";

function Select({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

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
      <label className="absolute -top-2 left-3 bg-gray-950 px-1 text-[10px] tracking-widest uppercase text-gray-500">
        {label}
      </label>

      <button
        onClick={() => setOpen(!open)}
        className="
          w-full flex items-center justify-between
          bg-slate-800 text-gray-200 text-sm
          border border-gray-800 rounded-xl
          px-4 py-2.5
          hover:border-gray-700
          focus:outline-none focus:ring-2 focus:ring-blue-500/40
          transition
        "
      >
        {selected?.label}
        <ChevronDown
          size={16}
          className={`transition ${open ? "rotate-180 text-blue-400" : "text-gray-400"}`}
        />
      </button>

      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            bg-gray-900 border border-gray-800 rounded-xl
            shadow-xl overflow-hidden
            animate-in fade-in slide-in-from-top-1
          "
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
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"}
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
