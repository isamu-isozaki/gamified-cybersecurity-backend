export const success = (res, data) => {
  res.status(200).json(data);
};

export const internalServerError = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Internal Server Error' });
};

export const notFound = (res, message) => {
  res.status(404).json({ message: message || 'Not Found' });
};

export const badRequest = (res, message) => {
  res.status(400).json({ message });
};
