# Exercise 3: Dynamic Form Builder

**Difficulty**: Medium  
**Time**: 25-30 minutes  
**Concepts**: Controlled inputs, dynamic rendering, form validation, array manipulation

## Challenge

Build a dynamic form builder that allows users to add/remove form fields and validates the entire form before submission. This tests your understanding of controlled components, dynamic lists, and form handling in React.

## Requirements

1. Display a list of form fields (initially empty or with one field)
2. Each field should have:
   - Label input
   - Value input
   - Field type selector (text, email, number)
   - Remove button
3. Add a "Add Field" button that adds a new field to the form
4. Add a "Submit" button that validates all fields
5. Validation rules:
   - Labels cannot be empty
   - Email fields must contain a valid email format
   - Number fields must contain valid numbers
   - All fields must have a value
6. Display validation errors inline for each field
7. Show a success message on successful submission
8. Display the submitted data as JSON

## Edge Cases to Consider

- What happens when you remove the last field?
- How do you handle validation for different field types?
- What if a user submits without adding any fields?
- How do you generate unique keys for dynamic fields?

## Bonus Challenges

- Add more field types (url, tel, date)
- Add a "Duplicate Field" button
- Allow reordering fields with up/down buttons
- Add a "Clear All" button
- Save form state to localStorage
- Add field-level validation on blur

## TypeScript Tips

Create proper types for your field data structure. Consider using `useId` from React 18 for generating stable IDs.

