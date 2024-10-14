import { BadRequestException, Injectable } from '@nestjs/common';
import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';

import { PublicErrors } from '@common/types';

@Injectable()
export class GoogleStorageService {
  private storage: Storage;

  constructor() {
    this.storage = new Storage();
  }

  async generateSignedUrl(
    bucketName = 'bucket-name',
    gcsFileKey = 'file.txt',
  ): Promise<string> {
    const options: GetSignedUrlConfig = {
      version: 'v2',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60,
    };

    const [url] = await this.storage
      .bucket(bucketName)
      .file(gcsFileKey)
      .getSignedUrl(options);

    return url;
  }

  async uploadFile(
    bucketName = 'bucket-name',
    gcsFileKey = 'file.txt',
    data: Express.Multer.File,
  ): Promise<string> {
    const writeStream = this.storage
      .bucket(bucketName)
      .file(gcsFileKey)
      .createWriteStream();

    return new Promise((resolve, rejects) => {
      writeStream.on('error', (error) => {
        rejects(
          new BadRequestException({
            code: PublicErrors.UPLOAD_FAILED,
            message: 'Error occurred while uploading file',
            error,
          }),
        );
      });

      writeStream.on('finish', () => {
        resolve(gcsFileKey);
      });

      writeStream.end(data.buffer);
    });
  }
}
