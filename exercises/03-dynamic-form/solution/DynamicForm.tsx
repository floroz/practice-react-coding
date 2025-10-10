import { useState, useId } from "react";
import styles from "./DynamicForm.module.css";

type FieldType = "text" | "email" | "number";

interface FormField {
  id: string;
  label: string;
  value: string;
  type: FieldType;
  error?: string;
}

export default function DynamicForm() {
  const formId = useId();
  const [fields, setFields] = useState<FormField[]>([
    { id: `${formId}-0`, label: "", value: "", type: "text" },
  ]);
  const [submittedData, setSubmittedData] = useState<Record<
    string,
    string
  > | null>(null);

  const addField = () => {
    const newField: FormField = {
      id: `${formId}-${String(Date.now())}`,
      label: "",
      value: "",
      type: "text",
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, ...updates, error: undefined } : field
      )
    );
  };

  const validateField = (field: FormField): string | undefined => {
    if (!field.label.trim()) {
      return "Label is required";
    }
    if (!field.value.trim()) {
      return "Value is required";
    }

    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        return "Invalid email format";
      }
    }

    if (field.type === "number") {
      if (isNaN(Number(field.value))) {
        return "Must be a valid number";
      }
    }

    return undefined;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fields.length === 0) {
      alert("Please add at least one field");
      return;
    }

    // Validate all fields
    const validatedFields = fields.map((field) => ({
      ...field,
      error: validateField(field),
    }));

    const hasErrors = validatedFields.some((field) => field.error);

    if (hasErrors) {
      setFields(validatedFields);
      return;
    }

    // Create submitted data object
    const data = validatedFields.reduce<Record<string, string>>(
      (acc, field) => {
        acc[field.label] = field.value;
        return acc;
      },
      {}
    );

    setSubmittedData(data);
  };

  return (
    <div className={styles.container}>
      <h2>Dynamic Form Builder</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {fields.map((field) => (
          <div
            key={field.id}
            className={`${styles.field} ${field.error ? styles.error : ""}`}
          >
            <div className={styles.fieldHeader}>
              <input
                type="text"
                placeholder="Field Label"
                value={field.label}
                onChange={(e) => {
                  updateField(field.id, { label: e.target.value });
                }}
              />
              <select
                value={field.type}
                onChange={(e) => {
                  updateField(field.id, { type: e.target.value as FieldType });
                }}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="number">Number</option>
              </select>
              {fields.length > 1 && (
                <button
                  type="button"
                  className={styles.danger}
                  onClick={() => {
                    removeField(field.id);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
            <div className={styles.fieldValue}>
              <input
                type={field.type}
                placeholder={`Enter ${field.label || "value"}`}
                value={field.value}
                onChange={(e) => {
                  updateField(field.id, { value: e.target.value });
                }}
              />
            </div>
            {field.error && (
              <div className={styles.errorMessage}>{field.error}</div>
            )}
          </div>
        ))}

        <div className={styles.buttons}>
          <button type="button" className={styles.secondary} onClick={addField}>
            Add Field
          </button>
          <button type="submit">Submit Form</button>
        </div>
      </form>

      {submittedData && (
        <div className={styles.success}>
          <h3>Form Submitted Successfully!</h3>
          <pre>{JSON.stringify(submittedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
