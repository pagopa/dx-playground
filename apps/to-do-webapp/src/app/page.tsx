import styles from "./page.module.css";
import {client} from "@/lib/api";
import {pipe} from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";

const getInfo = async () => {
  return pipe(
    TE.tryCatch(
      () => client.info({}),
      () => new Error('Server error')
    ),
    TE.map(E.mapLeft((errors) => new Error(errors.join('\n')))),
    TE.chain(TE.fromEither),
    TE.fold(
      (error) => () => Promise.reject(error),
      (result) => () => Promise.resolve(result),
    )
  )();
}

export default async function Home() {
  try {
    const {status, value } =  await getInfo();
    if (status === 200) {
      return (
        <div className={styles.page}>
          <main className={styles.main}>
            <div>
              App Name: {value.name} - version {value.version}
            </div>
          </main>
        </div>
      );
    } else {
      return (
        <div className={styles.page}>
          <main className={styles.main}>
            <div>
              Response: {status}
            </div>
          </main>
        </div>
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <div>
            Error fetching data
          </div>
        </main>
      </div>
    );
  }
}
