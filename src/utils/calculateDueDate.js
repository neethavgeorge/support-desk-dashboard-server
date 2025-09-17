// utils/calculateDueDate.js
export const calculateDueDate = (priority) => {
  const now = new Date();
  let daysToAdd = 0;

  switch (priority) {
    case "high":
      daysToAdd = 1;
      break;
    case "medium":
      daysToAdd = 3;
      break;
    case "low":
      daysToAdd = 7;
      break;
    default:
      daysToAdd = 5; // default buffer
  }

  const dueDate = new Date(now.setDate(now.getDate() + daysToAdd));
  return dueDate;
};
