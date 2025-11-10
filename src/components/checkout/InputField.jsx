const InputField = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    min,
    value,
    placeholder,
}) => {
    return (
        <div className="mb-3">
            <label htmlFor={id} className="form-label fw-semibold">
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                className={`form-control ${errors[id]?.message ? "is-invalid" : ""}`}
                {...register(id, {
                    required: { value: required, message },
                    minLength: min
                        ? { value: min, message: `Mínimo ${min} caracteres` }
                        : undefined,
                    pattern:
                        type === "email"
                            ? {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Correo inválido"
                            }
                            : type === "url"
                            ? {
                                value: /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                                message: "URL inválida"
                            }
                            : undefined,
                })}
                value={value}
            />
            {errors[id]?.message && (
                <div className="invalid-feedback">
                    {errors[id]?.message}
                </div>
            )}
        </div>
    );
};

export default InputField;