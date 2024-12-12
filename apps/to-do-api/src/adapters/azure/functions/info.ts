import * as H from "@pagopa/handler-kit";
import { httpAzureFunction } from "@pagopa/handler-kit-azure-func";
import * as RTE from "fp-ts/lib/ReaderTaskEither.js";

import { ApplicationInfo } from "../../../generated/definitions/internal/ApplicationInfo.js";

const makeHandlerKitHandler: H.Handler<
  H.HttpRequest,
  | H.HttpResponse<ApplicationInfo>
  | H.HttpResponse<H.ProblemJson, H.HttpErrorStatusCode>
> = H.of(() => RTE.of(H.successJson({ name: "ToDo", version: "0.0.0" })));

export const makeInfoHandler = httpAzureFunction(makeHandlerKitHandler);
