/**
 * Reusable select dropdown for enum categories.
 */
interface CategorySelectProps<T extends number> {
    label: string;
    value: T | null;
    options: { value: T; label: string }[];
    onChange: (v: T | null) => void;
    className?: string;
}

function CategorySelect<T extends number>({ label, value, options, onChange, className = '' }: CategorySelectProps<T>) {
    return (
        <select
            className={`bg-[#1a1a2e] border border-[#3a3a5c] rounded-lg px-2 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 ${className}`}
            value={value ?? ''}
            onChange={(e) => {
                const v = e.target.value;
                onChange(v === '' ? null : (Number(v) as T));
            }}
            title={label}
        >
            <option value="">{label}</option>
            {options.map((o) => (
                <option key={o.value} value={o.value}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}

export default CategorySelect;
