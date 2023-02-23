import { useState } from 'react';

export default function useErrors() {
  const [errors, setErrors] = useState([]);

  function setError({ field, message }) {
    const errorAlreadyExists = errors.find((error) => error.field === field);
    if (errorAlreadyExists) return;

    setErrors((prevState) => [...prevState, { field, message }]);
  }

  function removeError(field) {
    setErrors((prevState) => prevState.filter((error) => error.field !== field));
  }

  function getErrorMessageByFieldName(fieldName) {
    return errors.find((error) => error.field === fieldName)?.message;
  }

  return {
    setError,
    removeError,
    getErrorMessageByFieldName,
    errors,
  };
}
