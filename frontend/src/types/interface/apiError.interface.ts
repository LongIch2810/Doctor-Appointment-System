export interface ApiError {
  statusCode: number;
  success: boolean;
  data: any;
  error: { code: string; details: string[] | string };
}
