export interface MyInfoEditPresenterProps {
  initialValues: updateEditProfileParams;
  onSubmit: (values: updateEditProfileParams) => void;
}
export interface updateEditProfileParams {
  image: string;
  oldEmail: string;
  newEmail: string;
  name: string;
  password: string;
  phone?: string;
  agreeSms?: boolean;
  agreeEmail?: boolean;
  logging: string | null;
}
