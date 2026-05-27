import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

import Head from "next/head";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { wrapper } from "../store/store";
import { getUserData } from "../store/slice/auth.slice";

import { useDispatch } from "react-redux";
import { setModalOpen, setTextDirection } from "../store/slice/layout.slice";

function App({ Component, pageProps }) {
  const locale = "ltr"
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUserData());
  }, [dispatch]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);

  const { pathname } = useRouter();
  dispatch(setTextDirection(locale));

  useEffect(() => {
    dispatch(setModalOpen(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>Auticare Console</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta content='Auticare is an XR-AI based Assistive Technology learning platform for Autism Spectrum Disorder(ASD) and special education.' name='description' />
        <meta content='Byte Infotech' name='author' />
        {/* <!-- App favicon --> */}
        <link rel='shortcut icon' href='/images/favicon/favicon.ico' />
        <link rel='apple-touch-icon' sizes='180x180' href='/images/favicon/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/images/favicon/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/images/favicon/favicon-16x16.png' />
      </Head>
      <Component {...pageProps} dir={locale} />
    </>
  );
}

export default wrapper.withRedux(App);
