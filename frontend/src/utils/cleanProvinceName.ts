export const cleanProvinceName = (provinceName: string) => {
  return provinceName.replace(/^(Tỉnh | Thành phố)\s*/i, "");
};
