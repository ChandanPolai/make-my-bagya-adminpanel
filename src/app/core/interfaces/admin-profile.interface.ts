export interface UserDetails {
    message: string;
    data:    Data;
    status:  number;
}

export interface Data {
  name: string;
  email: string;
  avatar?: File | string;
  password?: string;
  mobile: string;
}