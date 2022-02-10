const isDateString = (date: unknown): date is Date => {
  if (!date || date === null) {
    return false;
  }

  if (typeof date !== 'string') {
    return false;
  }

  if (Number.isNaN(Date.parse(date))) {
    return false;
  }

  return true;
};

export default {
  isDateString,
};
