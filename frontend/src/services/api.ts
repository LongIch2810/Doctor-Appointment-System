// src/services/api.ts
// Mock API (chưa dùng trong ví dụ này)
export const fetchData = async () => {
  return await new Promise((resolve) =>
    setTimeout(() => resolve({ message: "Fetched!" }), 500)
  );
};
