import { useState, useTransition } from "react";
import styles from "./SearchTransition.module.css";

interface Item {
  id: number;
  name: string;
  category: string;
  description: string;
}

// TODO: Generate large dataset
function generateItems(count: number): Item[] {
  // Implement data generation
  return [];
}

export default function SearchTransition() {
  // TODO: Implement search with useTransition

  return (
    <div className={styles.container}>
      <h2>Search with useTransition</h2>
      <div className={styles.search}>{/* Search input */}</div>
      <div className={styles.results}>{/* Display filtered results */}</div>
    </div>
  );
}
