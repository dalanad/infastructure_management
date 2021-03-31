import { CompressionMiddleware } from "./compression";
import { AddTailingSlash } from "./tailing-slash";
import {registerViewHelpers} from "./register-view-helpers";


export default [ CompressionMiddleware, AddTailingSlash,registerViewHelpers ]