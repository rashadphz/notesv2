/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EmbeddingsRequest } from '../models/EmbeddingsRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class EmbeddingsService {

    /**
     * Create Embeddings
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static createEmbeddings(
        requestBody: EmbeddingsRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/create_embeddings/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
