import { useState } from "react";
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
  // TODO: Implement dynamic form functionality

  return (
    <div className={styles.container}>
      <h2>Dynamic Form Builder</h2>
      <div className={styles.form}>
        {/* Render form fields dynamically */}

        {/* Add Field button */}

        {/* Submit button */}
      </div>
    </div>
  );
}
