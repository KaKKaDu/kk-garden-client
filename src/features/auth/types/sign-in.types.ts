export type SignInFeedbackMessage = {
  kind: 'error' | 'success';
  message: string;
};

export type SignInFeedbackProps = {
  feedback: SignInFeedbackMessage | null;
};
