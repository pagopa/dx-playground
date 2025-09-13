import * as fs from "fs";
import * as yaml from "js-yaml";

import { IFileReader } from "../../domain/index.js";

export class FileReaderAdapter implements IFileReader {
  async readYamlFile(filePath: string): Promise<unknown> {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return yaml.load(fileContent);
  }
}
