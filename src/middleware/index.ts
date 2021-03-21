import { CompressionMiddleware } from "./compression";
import { AddTailingSlash } from "./tailing-slash";


export default [ CompressionMiddleware, AddTailingSlash ]