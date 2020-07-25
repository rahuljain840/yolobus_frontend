export const getCurrentMonth = (asObj) => {
  const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  const currentDate = new Date();
  if (asObj) {
    const date = monthsArr[currentDate.getMonth()] + ', ' + currentDate.getFullYear();  //For package links with current month
    return { label: date, value: date };
  }
  return currentDate.getMonth(); //For Listing API which uses 0-based month value
};
