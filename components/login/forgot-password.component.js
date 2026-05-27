import Link from "next/link";

function ForgotPassword() {
  return (
    <Link href='/forgot-password'>
      <a className='text-muted'>
        <i className='mdi mdi-lock mr-1'></i> Forgot your password?
      </a>
    </Link>
  );
}
export default ForgotPassword;
