export interface RegisterPersonRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  numberId: string;
  password: string;
  confirmPassword: string;
  documentType: string;
  extraData?: string | null;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}
